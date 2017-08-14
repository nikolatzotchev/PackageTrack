package com.begin.sensors;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Sensors {
    @Id
    @GeneratedValue
    private Long id;

    private Double temp;
    private Double humid;
    private Double latitude;
    private Double longitude;

    public Sensors(){}

    public Sensors(Double temp, Double humid) {
        this.temp = temp;
        this.humid = humid;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getTemp() {
        return temp;
    }

    public void setTemp(Double temp) {
        this.temp = temp;
    }

    public Double getHumid() {
        return humid;
    }

    public void setHumid(Double humid) {
        this.humid = humid;
    }


    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}