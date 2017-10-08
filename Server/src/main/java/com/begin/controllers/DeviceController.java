package com.begin.controllers;

import com.begin.ResourceNotFoundException;
import com.begin.dto.ReportDTO;
import com.begin.entities.Device;
import com.begin.entities.Report;
import com.begin.entities.Trip;
import com.begin.entities.Value;
import com.begin.repositories.DeviceRepository;
import com.begin.repositories.ReportRepository;
import com.begin.repositories.TripRepository;
import com.begin.repositories.ValueRepository;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

  private final DeviceRepository deviceRepository;
  private final TripRepository tripRepository;
  private final ReportRepository reportRepository;
  private final ValueRepository valueRepository;

  @Autowired
  public DeviceController(DeviceRepository deviceRepository,
      TripRepository tripRepository,
      ReportRepository reportRepository,
      ValueRepository valueRepository) {
    this.deviceRepository = deviceRepository;
    this.tripRepository = tripRepository;
    this.reportRepository = reportRepository;
    this.valueRepository = valueRepository;
  }

  @GetMapping
  public List<Device> listDevices() {
    return deviceRepository.findAll();
  }

  @PostMapping
  public Device registerNewDevice(
      @RequestBody(required = false) String serialNo) {
    Device device = new Device();
    device.setSerialNo(serialNo);
    return deviceRepository.saveAndFlush(device);
  }

  @GetMapping(path = "/{id}/trips")
  public List<Trip> allTrips(@PathVariable Long id) throws ResourceNotFoundException {
    Device device = getDevice(id);
    return tripRepository.findByDevice(device);
  }

  @GetMapping(path = "/{id}/lastTrip")
  public Trip lastTrip(@PathVariable Long id) throws ResourceNotFoundException {
    Device device = getDevice(id);
    Trip trip = tripRepository.findByDeviceOrderByEndTime(device);
    if (null == trip) {
      // there is no current trip with that device, so simply ignore the reportings
      throw new ResourceNotFoundException("Trip not found");
    }
    return trip;
  }

  @PostMapping(path = "/{id}/reports")
  public Report addReport(@PathVariable Long id, @RequestBody ReportDTO report)
      throws ResourceNotFoundException {
    Device device = getDevice(id);

    Trip trip = tripRepository.findByDeviceOrderByIdDesc(device);
    if (trip == null) {
      throw new ResourceNotFoundException("Could not find a trip!");
    }
    if (trip.getStartTime() == null) {
      throw new IllegalStateException(
          "This trip is not started yet, the report will not be saved!");
    }

    // store the values first
    List<Value> savedValues = new ArrayList<>();
    report.getIncidentValues().forEach(v -> savedValues.add(valueRepository.save(v)));
    // store the position
    Report newPosition = new Report();
    newPosition.setTrip(trip);
    newPosition.setLatitude(report.getLatitude());
    newPosition.setLongitude(report.getLongitude());
    newPosition.setTimestamp(ZonedDateTime.now());
    newPosition.setIncidentValues(savedValues);
    newPosition = reportRepository.save(newPosition);

    // store the reports now

    return newPosition;
  }

  private Device getDevice(Long deviceId) throws ResourceNotFoundException {
    Device device = deviceRepository.findOne(deviceId);
    if (device == null) {
      throw new ResourceNotFoundException("Device not found");
    }
    return device;
  }
}
