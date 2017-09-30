package com.begin.controllers;

import com.begin.entities.Position;
import com.begin.entities.Value;
import com.begin.repositories.DeviceRepository;
import com.begin.repositories.PositionRepository;
import com.begin.repositories.TripRepository;
import com.begin.repositories.ValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/position")
public class PositionController {

   private final PositionRepository positionRepository;
   private final ValueRepository valueRepository;
   private final DeviceRepository deviceRepository;
   private final TripRepository tripRepository;

    @Autowired
    public PositionController(DeviceRepository deviceRepository,
                          TripRepository tripRepository, PositionRepository positionRepository, ValueRepository valueRepository) {
        this.deviceRepository = deviceRepository;
        this.tripRepository = tripRepository;
        this.positionRepository = positionRepository;
        this.valueRepository = valueRepository;
    }

    @PostMapping
    public Position addPostion(@RequestBody Position position) {
        Position newPosition = new Position();
        newPosition.setLatitude(position.getLatitude());
        newPosition.setLongitude(position.getLongitude());
        newPosition.setTimestamp(ZonedDateTime.now());
        return newPosition;
    }

    public List<Value> checkIfIncident(List<Value> values) {
        //FIXME implement Ranges for valid values
        return null;
    }
}
