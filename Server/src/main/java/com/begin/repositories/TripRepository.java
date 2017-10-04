package com.begin.repositories;

import com.begin.entities.Device;
import com.begin.entities.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long>{
        List<Trip> findByEndTimeIsNull();

        List<Trip> findByDevice(Device device);
        Trip findByDeviceOrderByEndTime(Device device);
        Trip findByEndTimeIsNullAndDevice(Device device);
}
