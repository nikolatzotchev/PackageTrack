package com.begin.controllers;

import com.begin.ResourceNotFoundException;
import com.begin.dto.CreateTripDTO;
import com.begin.entities.Device;
import com.begin.entities.Report;
import com.begin.entities.Trip;
import com.begin.repositories.DeviceRepository;
import com.begin.repositories.ReportRepository;
import com.begin.repositories.TripRepository;
import com.begin.repositories.ValueRepository;
import java.time.ZonedDateTime;
import java.util.List;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
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

  @Autowired
  public TripController(DeviceRepository deviceRepository,
      TripRepository tripRepository,
      ReportRepository reportRepository,
      ValueRepository valueRepository) {
    this.deviceRepository = deviceRepository;
    this.tripRepository = tripRepository;
    this.reportRepository = reportRepository;
    this.valueRepository = valueRepository;
  }

  @GetMapping
  public List<Trip> listTrips(
      @RequestParam(required = false, defaultValue = "false") boolean includeCompletedTrips) {
    if (includeCompletedTrips) {
      return tripRepository.findAll();
    } else {
      return tripRepository.findByEndTimeIsNull();
    }
  }

  @GetMapping(path = "/{id}/")
  public Trip getTrip(@PathVariable Long id) throws ResourceNotFoundException {
    if (tripRepository.findOne(id) == null) {
      throw new ResourceNotFoundException("No such trip");
    }
    return tripRepository.findOne(id);
  }

  @PostMapping
  @Transactional
  public Trip createTrip(@RequestBody @Valid CreateTripDTO request) {
    Device device = deviceRepository.findOne(request.getDeviceId());
    if (null == device) {
      throw new IllegalStateException("There is no device with the specified ID!");
    }

    Trip oldTrip = tripRepository.findByEndTimeIsNullAndDevice(device);
    if (oldTrip != null) {
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

  @PostMapping(path = "/{id}/startTrip")
  public Trip startTrip(@PathVariable Long id) throws ResourceNotFoundException {
    Trip trip = getTrip(id);
    //check if trip can be started
    if (tripRepository.findByStartTimeIsNotNullAndEndTimeIsNullAndDevice(trip.getDevice())
        != null) {
      throw new IllegalStateException("One one trip on device can be in progress");
    }
    trip.setStartTime(ZonedDateTime.now());
    return tripRepository.save(trip);
  }

  @PostMapping(path = "/{id}/endTrip")
  public Trip endTrip(@PathVariable Long id) throws ResourceNotFoundException {
    Trip trip = getTrip(id);
    trip.setEndTime(ZonedDateTime.now());
    return tripRepository.save(trip);
  }

  @GetMapping(path = "/{id}/reports")
  public List<Report> getReports(@PathVariable Long id) throws ResourceNotFoundException {
    Trip trip = getTrip(id);
    return reportRepository.findByTripOrderByTimestamp(trip);
  }
}
