package com.begin.services;

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
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeviceService {
  private final DeviceRepository deviceRepository;
  private final TripRepository tripRepository;
  private final ReportRepository reportRepository;
  private final ValueRepository valueRepository;
  private final TripConfigurationRepository tripConfigurationRepository;

  @Autowired
  public DeviceService(DeviceRepository deviceRepository,
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

  public List<Device> returnAllDevices() {
    return deviceRepository.findAll();
  }

  public Device returnDevice(Long deviceId) throws ResourceNotFoundException {
    Device device = deviceRepository.findOne(deviceId);
    if (device == null) {
      throw new ResourceNotFoundException("Device not found");
    }
    return device;
  }

  public Device registerDevice(String serialNo) {
    Device device = new Device();
    device.setSerialNo(serialNo);
    return deviceRepository.saveAndFlush(device);
  }

  public void deleteDevice(Long deviceId) throws ResourceNotFoundException {
    Device device = returnDevice(deviceId);
    List<Trip> trips = tripRepository.findByDevice(device);
    tripConfigurationRepository.deleteByTripIn(trips);
    tripRepository.deleteByDevice(device);
    reportRepository.deleteByTripIn(trips);
    deviceRepository.delete(deviceId);
  }

  public List<Trip> returnAllTrips(Long deviceId) throws ResourceNotFoundException {
    Device device = returnDevice(deviceId);
    return tripRepository.findByDevice(device);
  }

  public Trip findCurrentTrip(Long deviceId) throws ResourceNotFoundException {
    Device device = returnDevice(deviceId);
    Trip trip = tripRepository.findByStartTimeIsNotNullAndEndTimeIsNullAndDevice(device);
    if (trip == null) {
      throw new ResourceNotFoundException("Could not find current trip!");
    }
    return trip;
  }

  public List<Trip> allEndedTrips(Long deviceId) throws ResourceNotFoundException {
    Device device = returnDevice(deviceId);
    List<Trip> trips = tripRepository.findByEndTimeIsNotNullAndDevice(device);
    if (trips == null) {
      throw new ResourceNotFoundException("Could not find any completed trips!");
    }
    return trips;
  }

  public Trip lastTrip(Long deviceId) throws ResourceNotFoundException {
    Device device = returnDevice(deviceId);
    Trip trip = tripRepository.findFirstByDeviceOrderByEndTime(device);
    if (null == trip) {
      // there is no current trip with that device, so simply ignore the reportings
      throw new ResourceNotFoundException("Trip not found");
    }
    return trip;
  }

  public Report addReport(ReportDTO report) throws ResourceNotFoundException {
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

    return newPosition;
  }

  private boolean checkIfIncident(Value value, Trip trip) {
    Metric metric = value.getMetric();
    TripConfiguration tripConfiguration = tripConfigurationRepository
        .findByTripAndMetric(trip, metric);
    //check if the value is in the range of valid values
    return tripConfiguration.checkValidValue(value.getValue());
  }

  public boolean hasCurrentTrip(String serialNo) {
    Device device = deviceRepository.findBySerialNo(serialNo);
    Trip trip = tripRepository.findByStartTimeIsNotNullAndEndTimeIsNullAndDevice(device);
    return trip != null;
  }
}
