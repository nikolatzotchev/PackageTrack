package com.begin.controllers;

import com.begin.ResourceNotFoundException;
import com.begin.entities.Device;
import com.begin.entities.Trip;
import com.begin.repositories.DeviceRepository;
import com.begin.repositories.PositionRepository;
import com.begin.repositories.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {
    private final DeviceRepository deviceRepository;
    private final TripRepository tripRepository;
    private final PositionRepository positionRepository;

    @Autowired
    public DeviceController(DeviceRepository deviceRepository,
                            TripRepository tripRepository, PositionRepository positionRepository) {
        this.deviceRepository = deviceRepository;
        this.tripRepository = tripRepository;
        this.positionRepository = positionRepository;
    }


    @GetMapping
    public List<Device> listDevices() {
        return deviceRepository.findAll();
    }

    @PostMapping
    public Device setupNewDevice(Device device) {
        return deviceRepository.saveAndFlush(device);
    }

    @GetMapping(path = "/{id}/trips")
    public List<Trip> allTrips(@PathVariable Long deviceId) throws ResourceNotFoundException {
        Device device = getDevice(deviceId);
        return tripRepository.findByDevice(device);
    }

    @GetMapping(path = "/{id}/lastEndedTrip")
    public Trip lastTrip(@PathVariable Long deviceId) throws ResourceNotFoundException {
        Device device = getDevice(deviceId);
        return tripRepository.findByDeviceOrderByEndTime(device);
    }

    @GetMapping(path = "/{id}/trip")
    public Trip currentTripe(@PathVariable Long deviceId) throws ResourceNotFoundException {
        Device device = getDevice(deviceId);
        return tripRepository.findByDeviceOrderByEndTime(device);

    }

    //fixme not final just improvising
    @PostMapping(path = "/assignDevice/")
    private Long assignDevice() {
        Device device = deviceRepository.findByAssignedTrue();
        device.setAssign(Boolean.TRUE);
        deviceRepository.saveAndFlush(device);
        return device.getId();
    }

    private Device getDevice(Long deviceId) throws ResourceNotFoundException {
        Device device = deviceRepository.findOne(deviceId);
        if(device == null) {
            throw new ResourceNotFoundException("Device not found");
        }
        return device;
    }
}
