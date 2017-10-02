package com.begin.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
public class Value {

    public enum Metric {
        Temperature("C"),
        Temperature_Fahrenheit("F"),
        Humidity("%");

        private String unit;

        Metric(String unit) {
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

    private String unit;

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

    public String getUnit() {
        return unit;
    }

    public void setUnit() {
        this.unit = getMetric().unit;
    }
}
