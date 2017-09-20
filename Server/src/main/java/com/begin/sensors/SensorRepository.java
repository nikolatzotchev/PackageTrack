package com.begin.sensors;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SensorRepository extends CrudRepository<Sensors, Long> {

    Sensors[] findAllTempBiggerThan(double minTemperature);
}
