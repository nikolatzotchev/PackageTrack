package com.begin.repositories;

import com.begin.entities.Report;
import com.begin.entities.Trip;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {

  List<Report> findByTripOrderByTimestamp(Trip trip);
  List<Report> deleteByTripIn(List<Trip> trips);
}
