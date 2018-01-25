package com.begin.entities;

import java.util.Objects;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Entity
public class Value {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @Enumerated(value = EnumType.ORDINAL)
  private Metric metric; // e.g. "Temperature"

  @NotNull
  private double value;

  public Metric getMetric() {
    return metric;
  }

  public void setMetric(Metric metric) {
    this.metric = metric;
  }

  public double getValue() {
    return value;
  }

  public void setValue(double value) {
    this.value = value;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Value value1 = (Value) o;
    return Double.compare(value1.value, value) == 0 &&
        Objects.equals(id, value1.id) &&
        metric == value1.metric;
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, metric, value);
  }

  public enum Metric {
    Temperature("C"),
    Temperature_Fahrenheit("F"),
    Humidity("%");

    private String unit;

    private Metric(String unit) {
      this.unit = unit;
    }

    public String getUnit() {
      return unit;
    }

  }
}
