package com.begin.repositories;

import com.begin.entities.Device;
import com.begin.entities.Trip;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepository extends JpaRepository<Trip, Long> {

  List<Trip> findByEndTimeIsNull();

  List<Trip> findByDevice(Device device);

  Trip findByDeviceOrderByEndTime(Device device);

  Trip findByEndTimeIsNullAndDevice(Device device);

  Trip findByStartTimeIsNotNullAndEndTimeIsNullAndDevice(Device device);

  Trip findByDeviceOrderByIdDesc(Device device);

  void deleteByDevice(Device device);
}
