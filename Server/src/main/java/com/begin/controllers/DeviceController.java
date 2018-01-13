package com.begin.controllers;

import com.begin.ResourceNotFoundException;
import com.begin.dto.ReportDTO;
import com.begin.entities.Device;
import com.begin.entities.Report;
import com.begin.entities.Trip;
import com.begin.entities.TripConfiguration;
import com.begin.entities.Value;
import com.begin.entities.Value.Metric;
import com.begin.repositories.DeviceRepository;
import com.begin.repositories.ReportRepository;
import com.begin.repositories.TripConfigurationRepository;
import com.begin.repositories.TripRepository;
import com.begin.repositories.ValueRepository;
import io.swagger.annotations.ApiOperation;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/devices")
public class DeviceController {

  private final DeviceRepository deviceRepository;
  private final TripRepository tripRepository;
  private final ReportRepository reportRepository;
  private final ValueRepository valueRepository;
  private final TripConfigurationRepository tripConfigurationRepository;

  @Autowired
  public DeviceController(DeviceRepository deviceRepository,
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
  @ApiOperation(value = "Връща всички устройства.")
  public List<Device> listDevices() {
    return deviceRepository.findAll();
  }

  @GetMapping(path = "/{deviceId}", produces = "application/json")
  @ApiOperation(value = "Връща дадено устройство.")
  public Device getDevice(@PathVariable Long deviceId) throws ResourceNotFoundException {
    Device device = deviceRepository.findOne(deviceId);
    if (device == null) {
      throw new ResourceNotFoundException("Device not found");
    }
    return device;
  }

  @PostMapping(produces = "application/json")
  @ApiOperation(value = "Добавяне на ново устройство.")
  public Device registerNewDevice(
      @RequestBody String serialNo) {
    Device device = new Device();
    device.setSerialNo(serialNo);
    return deviceRepository.saveAndFlush(device);
  }

  @Transactional
  @DeleteMapping(path = "/{deviceId}")
  @ApiOperation(value = "Изтриване на дадено устройство.",
      notes = "Заедно с устройството се изтриват и всички пътувания свързани към него.")
  public void deleteDevice(@PathVariable Long deviceId) throws ResourceNotFoundException {
    Device device = getDevice(deviceId);
    List<Trip> trips = tripRepository.findByDevice(device);
    tripConfigurationRepository.deleteByTripIn(trips);
    tripRepository.deleteByDevice(device);
    reportRepository.deleteByTripIn(trips);
    deviceRepository.delete(deviceId);
  }

  @GetMapping(path = "/{id}/trips", produces = "application/json")
  @ApiOperation(value = "Връща всички пътувания свързани с дадено устройство.")
  public List<Trip> allTrips(@PathVariable Long id) throws ResourceNotFoundException {
    Device device = getDevice(id);
    return tripRepository.findByDevice(device);
  }

  @GetMapping(path = "/{id}/currentTrip", produces = "application/json")
  @ApiOperation(value = "Ако устройството се използва, връща сегашното пътуване.")
  public Trip currentTrip(@PathVariable Long id) throws ResourceNotFoundException {
    Device device = getDevice(id);
    Trip trip = tripRepository.findByStartTimeIsNotNullAndEndTimeIsNullAndDevice(device);
    if (trip == null) {
      throw new ResourceNotFoundException("Could not find current trip!");
    }
    return trip;
  }

  @GetMapping(path = "/{id}/endedTrips", produces = "application/json")
  @ApiOperation(value = "Връща всички завършени пътувания на дадено устройство.")
  public List<Trip> endedTrips(@PathVariable Long id) throws ResourceNotFoundException {
    Device device = getDevice(id);
    List<Trip> trips = tripRepository.findByEndTimeIsNotNullAndDevice(device);
    if (trips == null) {
      throw new ResourceNotFoundException("Could not find any completed trips!");
    }
    return trips;
  }

  @GetMapping(path = "/{id}/lastTrip", produces = "application/json")
  @ApiOperation(value = "Връща последното завършено пътуване.")
  public Trip lastTrip(@PathVariable Long id) throws ResourceNotFoundException {
    Device device = getDevice(id);
    Trip trip = tripRepository.findFirstByDeviceOrderByEndTime(device);
    if (null == trip) {
      // there is no current trip with that device, so simply ignore the reportings
      throw new ResourceNotFoundException("Trip not found");
    }
    return trip;
  }

  @PostMapping(path = "/reports", produces = "application/json")
  @ApiOperation(value = "Добавяне на отчет към дадено устройство.",
      notes = "Отчета се праща към започнато пътуване, което може да има само едно.")
  public Report addReport(@RequestBody ReportDTO report)
      throws ResourceNotFoundException {
    Device device = deviceRepository.findBySerialNo(report.getSerialNo());

    Trip trip = tripRepository.findByEndTimeIsNullAndDevice(device);
    if (trip == null) {
      throw new ResourceNotFoundException("Could not find a trip!");
    }
    if (trip.getStartTime() == null) {
      throw new IllegalStateException(
          "This trip is not started yet, the report will not be saved!");
    }

    // check if the values are in the range and then add them
    List<Value> incidentValues = new ArrayList<>();
    report.getIncidentValues().forEach(v ->
    {
      if (checkIfIncident(v, trip)) {
        valueRepository.save(v);
        incidentValues.add(v);
      }
    });
    // store the position
    Report newPosition = new Report();
    newPosition.setTrip(trip);
    newPosition.setLatitude(report.getLatitude());
    newPosition.setLongitude(report.getLongitude());
    newPosition.setTimestamp(report.getTimestamp());
    newPosition.setIncidentValues(incidentValues);
    newPosition = reportRepository.save(newPosition);

    // store the reports now
    System.out.println();
    return newPosition;
  }

  @GetMapping(path = "/currentTrip")
  @ApiOperation(value = "Проверява по сериен номер дали дадено устройство има започнато пътуване.")
  public boolean currentTrip(@RequestBody String serialNo) {
    Device device = deviceRepository.findBySerialNo(serialNo);
    Trip trip = tripRepository.findByStartTimeIsNotNullAndEndTimeIsNullAndDevice(device);
    return trip != null;
  }

  private boolean checkIfIncident(Value value, Trip trip) {
    Metric metric = value.getMetric();
    TripConfiguration tripConfiguration = tripConfigurationRepository
        .findByTripAndMetric(trip, metric);
    //check if the value is in the range of valid values
    return tripConfiguration.checkValidValue(value.getValue());
  }
}
