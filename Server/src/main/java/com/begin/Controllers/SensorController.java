package com.begin.controllers;

import com.begin.sensors.Temp;
import com.begin.sensors.TempRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/data")
public class SensorController {

    @Autowired
    private TempRepository tmprepo;

    @RequestMapping(method = RequestMethod.POST, path = "/temp")
    public void addTemp(@RequestBody Temp temp) {
        this.tmprepo.save(temp);
    }

}