package com.begin.dto;

import com.begin.entities.Value.Metric;
import java.util.Objects;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotNull;

public class TripConfigurationDTO {

  @NotNull
  @Enumerated(value = EnumType.ORDINAL)
  private Metric metric;

  private Double min;

  private Double max;

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

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (!(o instanceof TripConfigurationDTO)) {
      return false;
    }
    TripConfigurationDTO that = (TripConfigurationDTO) o;
    return metric == that.metric &&
        Objects.equals(min, that.min) &&
        Objects.equals(max, that.max);
  }

  @Override
  public int hashCode() {
    return Objects.hash(metric, min, max);
  }
}
