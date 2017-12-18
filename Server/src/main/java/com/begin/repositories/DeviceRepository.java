package com.begin.repositories;

import com.begin.entities.Device;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceRepository extends JpaRepository<Device, Long> {

  Device findBySerialNo(String serialNo);
}
