package com.begin.entities;

import com.begin.entities.Value.Metric;
import java.util.Objects;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
public class TripConfiguration {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private Trip trip;

  @NotNull
  @Enumerated(value = EnumType.ORDINAL)
  private Metric metric; // e.g. "Temperature"

  private Double min;
  private Double max;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Trip getTrip() {
    return trip;
  }

  public void setTrip(Trip trip) {
    this.trip = trip;
  }

  public Metric getMetric() {
    return metric;
  }

  public void setMetric(Metric metric) {
    this.metric = metric;
  }

  public Double getMin() {
    return min;
  }

  public void setMin(Double min) {
    this.min = min;
  }

  public Double getMax() {
    return max;
  }

  public void setMax(Double max) {
    this.max = max;
  }

  public boolean checkValidValue(Double value) {
    //if the min and max are both null will return true for now, will think about it later
    if (getMax() == null && getMin() == null) {
      return true;
    } else if (getMax() == null) {
      return value >= getMin();
    } else if (getMin() == null) {
      return value <= getMax();
    }
    return value >= getMin() && value <= getMax();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    TripConfiguration that = (TripConfiguration) o;
    return Objects.equals(id, that.id) &&
        Objects.equals(trip, that.trip) &&
        metric == that.metric &&
        Objects.equals(min, that.min) &&
        Objects.equals(max, that.max);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, trip, metric, min, max);
  }
}
