package com.begin.repositories;

import com.begin.entities.Position;
import com.begin.entities.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PositionRepository extends JpaRepository<Position, Long> {
    List<Position> findByTripOrderByTimestamp(Trip trip);
}
