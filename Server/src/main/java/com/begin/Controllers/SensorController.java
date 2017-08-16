package com.begin.controllers;

import com.begin.sensors.Sensors;
import com.begin.sensors.SensorRepository;
import com.google.gson.Gson;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Iterator;

@RestController
@RequestMapping("/data")
public class SensorController {

    @Autowired
    private SensorRepository sensorRepository;

    @RequestMapping(method = RequestMethod.POST, path = "/sensors")
    public void addTemp(@RequestBody Sensors sensor) {
        this.sensorRepository.save(sensor);
    }

    @RequestMapping(method = RequestMethod.GET, path = "/retrieve/{id}")
    @ResponseBody public Sensors getUsers(@PathVariable("id") long id) {
        Sensors sem = sensorRepository.findOne(id);
        return sem;
    }

    @RequestMapping(method = RequestMethod.GET, path = "/123", produces = "application/json")
    @ResponseBody public String get1() {
        Sensors sem = new Sensors();
        JSONObject obj = new JSONObject();
        JSONArray arrayPath = new JSONArray();
        Iterator<Sensors> itr = sensorRepository.findAll().iterator();
        while (itr.hasNext()) {
            Sensors sen = itr.next();
            if (!itr.hasNext()) {
                try {
                    Gson gson = new Gson();
                    JSONObject request = new JSONObject(gson.toJson(sen));
                    obj.put("Current", request);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
            JSONObject objPath = new JSONObject();
            try {
                objPath.put("lat", sen.getLatitude());
                objPath.put("lng", sen.getLongitude());
                arrayPath.put(objPath);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        try {
            obj.put("Path", arrayPath);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return obj.toString();
    }

    private Boolean checkIncidend(Sensors sen) {
        if (sen.getTemp() > 40) {
            return true;
        }
        return false;
    }
}