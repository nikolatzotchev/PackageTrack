package com.begin.controllers;

import com.begin.sensors.Sensors;
import com.begin.sensors.SensorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/data")
public class SensorController {

    @Autowired
    private SensorRepository sensorRepository;

    @RequestMapping(method = RequestMethod.POST, path = "/sensors")
    public void addTemp(@RequestBody Sensors sensor) {
        this.sensorRepository.save(sensor);
    }
}