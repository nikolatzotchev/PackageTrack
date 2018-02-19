package com.begin.services;

import com.begin.ResourceNotFoundException;
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
import java.time.ZonedDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TripService {

  private final DeviceRepository deviceRepository;
  private final TripRepository tripRepository;
  private final ReportRepository reportRepository;
  private final TripConfigurationRepository tripConfigurationRepository;

  public TripService(DeviceRepository deviceRepository,
      TripRepository tripRepository,
      ReportRepository reportRepository,
      TripConfigurationRepository tripConfigurationRepository) {
    this.deviceRepository = deviceRepository;
    this.tripRepository = tripRepository;
    this.reportRepository = reportRepository;
    this.tripConfigurationRepository = tripConfigurationRepository;
  }

  public List<Trip> returnAllTrips(boolean includeCompletedTrips) {
    if (includeCompletedTrips) {
      return tripRepository.findAll();
    } else {
      return tripRepository.findByEndTimeIsNull();
    }
  }

  public Trip returnTrip(Long tripId) throws ResourceNotFoundException {
    if (tripRepository.findOne(tripId) == null) {
      throw new ResourceNotFoundException("No such trip");
    }
    return tripRepository.findOne(tripId);
  }

  public Trip createTrip(CreateTripDTO request) {
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

  public Trip deleteTrip(Long tripId) throws ResourceNotFoundException {
    Trip trip = returnTrip(tripId);
    this.tripConfigurationRepository.deleteByTrip(trip);
    this.tripRepository.delete(trip);
    return trip;
  }

  public Trip startTrip(Long tripId) throws ResourceNotFoundException {
    Trip trip = returnTrip(tripId);
    //check if trip can be started
    if (tripRepository.findByStartTimeIsNotNullAndEndTimeIsNullAndDevice(trip.getDevice())
        != null) {
      throw new IllegalStateException("One one trip on device can be in progress");
    }
    trip.setStartTime(ZonedDateTime.now());
    return tripRepository.save(trip);
  }

  public Trip endTrip(Long tripId) throws ResourceNotFoundException {
    Trip trip = returnTrip(tripId);
    trip.setEndTime(ZonedDateTime.now());
    return tripRepository.save(trip);
  }

  public List<Report> returnReports(Long tripId) throws ResourceNotFoundException {
    Trip trip = returnTrip(tripId);
    List<Report> reports = reportRepository.findByTripOrderByTimestamp(trip);
    if (reports.size() == 0) {
      throw new ResourceNotFoundException("No reports found for trip.");
    }
    return reports;
  }

  public List<TripConfiguration> returnConfiguration(Long tripId) throws ResourceNotFoundException {
    Trip trip = returnTrip(tripId);
    if (trip == null) {
      throw new ResourceNotFoundException("Cannot find trip with this id.");
    }
    return tripConfigurationRepository.findByTrip(trip);
  }

  public TripConfiguration setConfiguration(Long tripId, TripConfigurationDTO tripConfigurationDTO)
      throws ResourceNotFoundException {
    Trip trip = returnTrip(tripId);
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

  public List<TripConfiguration> deleteConfiguration(Long tripId) {
    Trip trip = tripRepository.findOne(tripId);
    if (trip.getStartTime() != null) {
      throw new IllegalStateException("Cannot delete Configuration when trip is started.");
    }
    return tripConfigurationRepository.deleteByTrip(trip);
  }
}
