package com.begin.Sensors;

public class Temp {
    private double temp;

    public Temp(double temp) {
        this.temp = temp;
    }

    public double getTemp() {
        return temp;
    }

    public void setTemp(double temp) {
        this.temp = temp;
    }

    public void displayTemp() {
        System.out.println(this.temp);
    }
}
