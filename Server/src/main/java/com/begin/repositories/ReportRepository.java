package com.begin.repositories;

import com.begin.entities.Report;
import com.begin.entities.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByTripOrderByTimestamp(Trip trip);
}
