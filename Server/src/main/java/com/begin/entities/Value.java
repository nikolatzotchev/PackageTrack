package com.begin.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
public class Value {

    public enum Metric {
        Temperature("C"),
        Temperature_Fahrenheit("F"),
        Pressure("Bar"),
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

}
