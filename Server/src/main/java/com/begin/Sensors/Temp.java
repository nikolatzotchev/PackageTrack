package com.begin.Sensors;

import com.fasterxml.jackson.annotation.JsonCreator;

public class Temp {
    private String  temp;

    public Temp() {}

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
