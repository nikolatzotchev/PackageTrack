package com.begin.Sensors;

import javax.persistence.Id;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;

@Entity
public class Temp {
    @Id
    @GeneratedValue
    private Long id;
    private String temp;

    public Temp() {}

    public Temp(String temp) {
        this.temp = temp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTemp() {
        return temp;
    }

    public void setTemp(String temp) {
        this.temp = temp;
    }

    public void displayTemp() {
        double value = Double.parseDouble(this.temp);
        System.out.println(value);
    }
}
