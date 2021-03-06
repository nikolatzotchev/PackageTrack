package com.begin.repositories;

import com.begin.entities.Device;
import com.begin.entities.Trip;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepository extends JpaRepository<Trip, Long> {

  List<Trip> findByEndTimeIsNull();

  List<Trip> findByDevice(Device device);

  List<Trip> findByStartTimeIsNull();

  List<Trip> findByEndTimeIsNotNullAndDevice(Device device);

  Trip findByStartTimeIsNotNullAndEndTimeIsNullAndDevice(Device device);

  Trip findFirstByDeviceOrderByEndTime(Device device);

  Trip findByEndTimeIsNullAndDevice(Device device);

  Trip findByDeviceOrderByIdDesc(Device device);

  List<Trip> deleteByDevice(Device device);
}
