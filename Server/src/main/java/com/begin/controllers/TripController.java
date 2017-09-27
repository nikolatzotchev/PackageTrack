package com.begin.controllers;

import com.begin.entities.Device;
import com.begin.entities.Position;
import com.begin.entities.Trip;
import com.begin.repositories.DeviceRepository;
import com.begin.repositories.PositionRepository;
import com.begin.repositories.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {
    private final DeviceRepository deviceRepository;
    private final TripRepository tripRepository;
    private final PositionRepository positionRepository;

    @Autowired
    public TripController(DeviceRepository deviceRepository,
                            TripRepository tripRepository, PositionRepository positionRepository) {
        this.deviceRepository = deviceRepository;
        this.tripRepository = tripRepository;
        this.positionRepository = positionRepository;
    }

    @GetMapping
    public List<Trip> listTrips () {
        return tripRepository.findAll();
    }

    @GetMapping(path = "/{id}/")
    public Trip getTrip(@PathVariable Long id) {
        return tripRepository.findOne(id);
    }

    @PostMapping
    public Trip createTrip (@RequestParam(required = false) String description,
                            @RequestParam Long deviceId) {
        Device device = deviceRepository.findOne(deviceId);
        Trip newTrip = new Trip();
        newTrip.setDescription(description);
        newTrip.setDevice(device);
        //trip is not started
        return tripRepository.save(newTrip);
    }

    @PostMapping(path = "/{id}/startTrip")
    public Trip startTrip(@PathVariable Long id) {
        Trip trip = getTrip(id);
        trip.setStartTime(ZonedDateTime.now());
        return tripRepository.save(trip);
    }

    @PostMapping(path = "/{id}/endTrip")
    public Trip endTrip(@PathVariable Long id) {
        Trip trip = getTrip(id);
        trip.setEndTime(ZonedDateTime.now());
        return tripRepository.save(trip);
    }

    @PostMapping(path = "/{id}/getPositions")
    public List<Position> getPostitions(@PathVariable Long id) {
        return positionRepository.findByTripOrderByTimestamp(getTrip(id));
    }
}
