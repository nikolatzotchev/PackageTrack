package com.begin.controllers;

import com.begin.ResourceNotFoundException;
import io.swagger.annotations.ApiOperation;
import com.begin.dto.CreateTripDTO;
import com.begin.dto.TripConfigurationDTO;
import com.begin.entities.Device;
import com.begin.entities.Report;
import com.begin.entities.Trip;
import com.begin.entities.TripConfiguration;
import com.begin.repositories.DeviceRepository;
import com.begin.repositories.ReportRepository;
import com.begin.repositories.TripConfigurationRepository;
import com.begin.repositories.TripRepository;
import com.begin.repositories.ValueRepository;
import java.time.ZonedDateTime;
import java.util.List;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/trips")
public class TripController {

  private final DeviceRepository deviceRepository;
  private final TripRepository tripRepository;
  private final ReportRepository reportRepository;
  private final ValueRepository valueRepository;
  private final TripConfigurationRepository tripConfigurationRepository;

  @Autowired
  public TripController(DeviceRepository deviceRepository,
      TripRepository tripRepository,
      ReportRepository reportRepository,
      ValueRepository valueRepository,
      TripConfigurationRepository tripConfigurationRepository) {
    this.deviceRepository = deviceRepository;
    this.tripRepository = tripRepository;
    this.reportRepository = reportRepository;
    this.valueRepository = valueRepository;
    this.tripConfigurationRepository = tripConfigurationRepository;
  }

  @GetMapping(produces = "application/json")
  @ApiOperation(value = "Връща всички пътувания.",
      notes = "Съдържа параметър, който определя дали да се включат завършените, по подразбиране не ги.")
  public List<Trip> listTrips(
      @RequestParam(required = false, defaultValue = "false") boolean includeCompletedTrips) {
    if (includeCompletedTrips) {
      return tripRepository.findAll();
    } else {
      return tripRepository.findByEndTimeIsNull();
    }
  }

  @GetMapping(path = "/{tripId}", produces = "application/json")
  @ApiOperation(value = "Връща дадено пътуване.",
  notes = "Намира го по дадено id")
  public Trip getTrip(@PathVariable Long tripId) throws ResourceNotFoundException {
    if (tripRepository.findOne(tripId) == null) {
      throw new ResourceNotFoundException("No such trip");
    }
    return tripRepository.findOne(tripId);
  }

  @PostMapping(produces = "application/json")
  @ApiOperation(value = "Създаване на ново пътуване.")
  public Trip createTrip(@RequestBody @Valid CreateTripDTO request) {
    Device device = deviceRepository.findOne(request.getDeviceId());
    if (null == device) {
      throw new IllegalStateException("There is no device with the specified ID!");
    }

    Trip tripInProgress = tripRepository.findByEndTimeIsNullAndDevice(device);
    if (tripInProgress != null) {
      throw new IllegalStateException(
          "This device is already used in another trip, please end the old trip, before starting a new one!");
    }

    // save the trip
    Trip trip = new Trip();
    trip.setDescription(request.getDescription());
    trip.setDevice(device);
    trip = tripRepository.save(trip);

    return trip;
  }

  @Transactional
  @DeleteMapping(path="/{tripId}/deleteTrip")
  @ApiOperation(value = "Изтриване на дадено пътуване.",
  notes = "Заедно с пътуването се изтрива и конфигурацията му.")
  public void deleteTrip(@PathVariable Long tripId) throws ResourceNotFoundException {
    Trip trip = getTrip(tripId);
    this.tripConfigurationRepository.deleteByTrip(trip);
    this.tripRepository.delete(trip);
  }

  @PostMapping(path = "/{tripId}/startTrip", produces = "application/json")
  @ApiOperation(value = "Стартиране на дедено пътуване.",
      notes = "Прави се проверка дали устройството вече няма стартирано пътуване.")
  public Trip startTrip(@PathVariable Long tripId) throws ResourceNotFoundException {
    Trip trip = getTrip(tripId);
    //check if trip can be started
    if (tripRepository.findByStartTimeIsNotNullAndEndTimeIsNullAndDevice(trip.getDevice())
        != null) {
      throw new IllegalStateException("One one trip on device can be in progress");
    }
    trip.setStartTime(ZonedDateTime.now());
    return tripRepository.save(trip);
  }

  @PostMapping(path = "/{tripId}/endTrip", produces = "application/json")
  @ApiOperation(value = "Приключване на дадено пътуване.")
  public Trip endTrip(@PathVariable Long tripId) throws ResourceNotFoundException {
    Trip trip = getTrip(tripId);
    trip.setEndTime(ZonedDateTime.now());
    return tripRepository.save(trip);
  }

  @GetMapping(path = "/{tripId}/reports", produces = "application/json")
  @ApiOperation(value = "Връща всички отчети за дадено пътуване.")
  public List<Report> getReports(@PathVariable Long tripId) throws ResourceNotFoundException {
    Trip trip = getTrip(tripId);
    List<Report> reports = reportRepository.findByTripOrderByTimestamp(trip);
    if (reports.size() == 0) {
      throw new ResourceNotFoundException("No reports found for trip.");
    }
    return reports;
  }

  @GetMapping(path = "/{tripId}/configurations", produces = "application/json")
  @ApiOperation(value = "Връща конфигурацията на дедено пътуване.")
  public List<TripConfiguration> getConfiguration(@PathVariable Long tripId)
      throws ResourceNotFoundException {
    Trip trip = tripRepository.findOne(tripId);
    if (trip == null) {
      throw new ResourceNotFoundException("Cannot find trip with this id.");
    }
    return tripConfigurationRepository.findByTrip(trip);
  }

  @PostMapping(path = "/{tripId}/configurations", produces = "application/json")
  @ApiOperation(value = "Създаване на нова конфигурация на дадено пътуване.")
  public TripConfiguration setConfiguration(@PathVariable Long tripId,
     @RequestBody TripConfigurationDTO tripConfigurationDTO) throws ResourceNotFoundException {

    Trip trip = tripRepository.findOne(tripId);
    if (trip == null) {
      throw new ResourceNotFoundException("Cannot find trip with this id."
          + " Consider adding a trip before setting the Configuration");
    }

    if (trip.getStartTime() != null) {
      throw new IllegalStateException("Trip has already started.");
    }
    TripConfiguration tripConfiguration = new TripConfiguration();
    tripConfiguration.setMetric(tripConfigurationDTO.getMetric());
    tripConfiguration.setMin(tripConfigurationDTO.getMin());
    tripConfiguration.setMax(tripConfigurationDTO.getMax());
    tripConfiguration.setTrip(trip);
    tripConfigurationRepository.save(tripConfiguration);

    return tripConfiguration;
  }

  @DeleteMapping(path = "/{tripId}/configurations")
  @ApiOperation(value = "Премахване на конфигурация на дадено пътуване.")
  public void deleteConfiguration(@PathVariable Long tripId){
    Trip trip = tripRepository.findOne(tripId);
    if (trip.getStartTime() != null) {
      throw new IllegalStateException("Cannot delete Configuration when trip is started.");
    }
    tripConfigurationRepository.delete(tripConfigurationRepository.findByTrip(trip));
  }
}
