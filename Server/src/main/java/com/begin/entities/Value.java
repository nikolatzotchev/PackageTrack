package com.begin.entities;

import java.util.Objects;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
public class Value {

    public enum Metric {
        Temperature("C"),
        Temperature_Fahrenheit("F"),
        Humidity("%");

        private String unit;

        public String getUnit() {
            return unit;
        }

        private Metric(String unit) {
            this.unit = unit;
        }

    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated( value = EnumType.ORDINAL)
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
}
