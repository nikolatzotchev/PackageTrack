package com.begin.controllers;

import com.begin.ResourceNotFoundException;
import com.begin.dto.CreateTripDTO;
import com.begin.dto.ReportDTO;
import com.begin.entities.Device;
import com.begin.entities.Report;
import com.begin.entities.Trip;
import com.begin.entities.Value;
import com.begin.repositories.DeviceRepository;
import com.begin.repositories.ReportRepository;
import com.begin.repositories.TripRepository;
import com.begin.repositories.ValueRepository;
import java.util.ArrayList;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;


import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
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

    // FIXME: probably it's easier from device to use the device ID
    // so it should be POST /api/devices/<id>/report. That will take the current started trip.
    @PostMapping(path = "/{id}/reports")
    public Report addReport(@PathVariable Long id, @RequestBody ReportDTO report) throws ResourceNotFoundException {
      Trip trip = getTrip(id);

      if (trip.getStartTime() == null) {
        throw new IllegalStateException("This trip is not started yet, the report will not be saved!");
      }

      // store the values first
      List<Value> savedValues = new ArrayList<>();
      report.getIncidentValues().forEach( v -> {
        savedValues.add(valueRepository.save(v));
      });


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

}
