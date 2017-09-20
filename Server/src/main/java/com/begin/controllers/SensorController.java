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

    private Long packageNumber;
    @Autowired
    private SensorRepository sensorRepository;

    @RequestMapping(method = RequestMethod.POST, path = "/newpackage")
    public String addPackage(@RequestParam Long number) {
        packageNumber = number;
        return "New Position added.";
    }
    @RequestMapping(method = RequestMethod.POST, path = "/sensors")
    public void addTemp(@RequestBody Sensors sensor) {
        if (packageNumber != null) {
            sensor.setPackageNumber(packageNumber);
            this.sensorRepository.save(sensor);
        }
    }

    @RequestMapping(method = RequestMethod.GET, path = "/retrieve/{id}")
    @ResponseBody public Sensors getUsers(@PathVariable("id") long id) {
        Sensors sem = sensorRepository.findOne(id);
        return sem;
    }

    @RequestMapping(method = RequestMethod.GET, path = "/path/{number}", produces = "application/json")
    @ResponseBody public String getPath(@PathVariable("number") Long number) {
        JSONObject obj = new JSONObject();
        JSONArray arrayPath = new JSONArray();
        Iterator<Sensors> itr = sensorRepository.findAll().iterator();
        while (itr.hasNext()) {
            Sensors sen = itr.next();
            if (sen.getPackageNumber() == number) {
                JSONObject objPath = new JSONObject();
                try {
                    objPath.put("lat", sen.getLatitude());
                    objPath.put("lng", sen.getLongitude());
                    arrayPath.put(objPath);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        if(arrayPath.length() == 0) {
            return "No such Position.";
        }
        try {
            obj.put("Position", arrayPath);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return obj.toString();
    }

    @RequestMapping(method = RequestMethod.GET, path = "/current", produces = "application/json")
    @ResponseBody public String getLastPos() {
        JSONObject obj = new JSONObject();
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
        }
        return obj.toString();
    }

    @RequestMapping(method = RequestMethod.GET, path = "/incidents/{number}", produces = "application/json")
    public String getAllIncidents(@PathVariable("number") Long number) throws JSONException {
        JSONObject obj = new JSONObject();
        JSONArray arrayPath = new JSONArray();
        Iterator<Sensors> itr = sensorRepository.findAll().iterator();
        while (itr.hasNext()) {
            Sensors sen = itr.next();
            if (sen.getPackageNumber() == number) {
                if (checkIncident(sen)) {
                    Gson gson = new Gson();
                    JSONObject inc = new JSONObject(gson.toJson(sen));
                    arrayPath.put(inc);
                }
            }
        }
        obj.put("Incidents", arrayPath);
        return obj.toString();
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/delete/trip/{number}")
    public String deleteTrip(@PathVariable("number") Long number) {
        Iterator<Sensors> itr = sensorRepository.findAll().iterator();
        while (itr.hasNext()) {
            if(itr.next().getPackageNumber() == number) {
                sensorRepository.delete(itr.next());
            }
        }
        return "Trip deleted.";
    }
    private Boolean checkIncident(Sensors sen) {
        if (sen.getTemp() > 40) {
            return true;
        }
        return false;
    }
}