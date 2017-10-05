package com.begin.controllers;

import com.begin.ResourceNotFoundException;
import com.begin.entities.Device;
import com.begin.entities.Trip;
import com.begin.repositories.DeviceRepository;
import com.begin.repositories.ReportRepository;
import com.begin.repositories.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {
    private final DeviceRepository deviceRepository;
    private final TripRepository tripRepository;
    private final ReportRepository reportRepository;

    @Autowired
    public DeviceController(DeviceRepository deviceRepository,
                            TripRepository tripRepository,
                            ReportRepository reportRepository) {
        this.deviceRepository = deviceRepository;
        this.tripRepository = tripRepository;
        this.reportRepository = reportRepository;
    }

    @GetMapping
    public List<Device> listDevices() {
        return deviceRepository.findAll();
    }

    @PostMapping
    public Device registerNewDevice(
        @RequestBody(required = false) String serialNo) {
        Device device = new Device();
        device.setSerialNo(serialNo);
        return deviceRepository.saveAndFlush(device);
    }

    @GetMapping(path = "/{id}/trips")
    public List<Trip> allTrips(@PathVariable Long id) throws ResourceNotFoundException {
        Device device = getDevice(id);
        return tripRepository.findByDevice(device);
    }

    @GetMapping(path = "/{id}/lastTrip")
    public Trip lastTrip(@PathVariable Long id) throws ResourceNotFoundException {
        Device device = getDevice(id);
        Trip trip = tripRepository.findByDeviceOrderByEndTime(device);
        if (null == trip) {
            // there is no current trip with that device, so simply ignore the reportings
            throw new ResourceNotFoundException("Trip not found");
        }
        return trip;
    }

    private Device getDevice(Long deviceId) throws ResourceNotFoundException {
        Device device = deviceRepository.findOne(deviceId);
        if(device == null) {
            throw new ResourceNotFoundException("Device not found");
        }
        return device;
    }
}
