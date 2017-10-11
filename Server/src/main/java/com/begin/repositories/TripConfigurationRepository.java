package com.begin.repositories;


import com.begin.entities.Trip;
import com.begin.entities.TripConfiguration;
import com.begin.entities.Value.Metric;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripConfigurationRepository extends JpaRepository<TripConfiguration, Long> {

  List<TripConfiguration> findByTrip(Trip trip);
  TripConfiguration findByTripAndMetric(Trip trip, Metric metric);

}
