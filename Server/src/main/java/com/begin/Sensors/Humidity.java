package com.begin.Sensors;

public class Humidity {
    private String procent;

    public double getProcent() {
        return Double.parseDouble(this.procent);
    }

    public void setProcent(String procent) {
        this.procent = procent;
    }

}
