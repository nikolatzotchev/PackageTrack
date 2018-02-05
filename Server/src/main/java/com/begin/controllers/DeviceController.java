package com.begin.controllers;

import com.begin.ResourceNotFoundException;
import com.begin.dto.ReportDTO;
import com.begin.entities.Device;
import com.begin.entities.Report;
import com.begin.entities.Trip;
import com.begin.services.DeviceService;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/devices")
public class DeviceController {

  private final DeviceService deviceService;

  public DeviceController(DeviceService deviceService) {
    this.deviceService = deviceService;
  }

  @GetMapping(produces = "application/json")
  @ApiOperation(value = "Връща всички устройства.")
  public List<Device> listDevices() {
    return deviceService.returnAllDevices();
  }

  @GetMapping(path = "/{deviceId}", produces = "application/json")
  @ApiOperation(value = "Връща дадено устройство.")
  public Device getDevice(@PathVariable Long deviceId) throws ResourceNotFoundException {
    return deviceService.returnDevice(deviceId);
  }

  @PostMapping(produces = "application/json")
  @ApiOperation(value = "Добавяне на ново устройство.")
  public Device registerNewDevice(
      @RequestBody String serialNo) {
    return  deviceService.registerDevice(serialNo);
  }

  @Transactional
  @DeleteMapping(path = "/{deviceId}")
  @ApiOperation(value = "Изтриване на дадено устройство.",
      notes = "Заедно с устройството се изтриват и всички пътувания свързани към него.")
  public Device deleteDevice(@PathVariable Long deviceId) throws ResourceNotFoundException {
    return deviceService.deleteDevice(deviceId);
  }

  @GetMapping(path = "/{deviceId}/trips", produces = "application/json")
  @ApiOperation(value = "Връща всички пътувания свързани с дадено устройство.")
  public List<Trip> allTrips(@PathVariable Long deviceId) throws ResourceNotFoundException {
    return deviceService.returnAllTrips(deviceId);
  }

  @GetMapping(path = "/{deviceId}/currentTrip", produces = "application/json")
  @ApiOperation(value = "Ако устройството се използва, връща сегашното пътуване.")
  public Trip currentTrip(@PathVariable Long deviceId) throws ResourceNotFoundException {
    return deviceService.findCurrentTrip(deviceId);
  }

  @GetMapping(path = "/{deviceId}/endedTrips", produces = "application/json")
  @ApiOperation(value = "Връща всички завършени пътувания на дадено устройство.")
  public List<Trip> endedTrips(@PathVariable Long deviceId) throws ResourceNotFoundException {
    return deviceService.allEndedTrips(deviceId);
  }

  @GetMapping(path = "/{deviceId}/lastTrip", produces = "application/json")
  @ApiOperation(value = "Връща последното завършено пътуване.")
  public Trip lastTrip(@PathVariable Long deviceId) throws ResourceNotFoundException {
    return deviceService.lastTrip(deviceId);
  }

  @PostMapping(path = "/reports", produces = "application/json")
  @ApiOperation(value = "Добавяне на отчет към дадено устройство.",
      notes = "Отчета се праща към започнато пътуване, което може да има само едно.")
  public Report addReport(@RequestBody ReportDTO report)
      throws ResourceNotFoundException {
    return deviceService.addReport(report);
  }

  @GetMapping(path = "/currentTrip")
  @ApiOperation(value = "Проверява по сериен номер дали дадено устройство има започнато пътуване.")
  public boolean hasCurrentTrip(@RequestBody String serialNo) {
    return deviceService.hasCurrentTrip(serialNo);
  }

}
