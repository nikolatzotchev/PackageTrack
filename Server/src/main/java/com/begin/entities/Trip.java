package com.begin.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import java.time.ZonedDateTime;

@Entity
public class Trip {
    @Id
    @GeneratedValue
    private Long Id;

    @OneToOne
    private Device device;

    private String description;

    private ZonedDateTime startTime;

    private ZonedDateTime endTime;

    public Device getDevice() {
        return device;
    }

    public void setDevice(Device device) {
        this.device = device;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ZonedDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(ZonedDateTime startTime) {
        this.startTime = startTime;
    }

    public ZonedDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(ZonedDateTime endTime) {
        this.endTime = endTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Trip trip = (Trip) o;

        if (Id != null ? !Id.equals(trip.Id) : trip.Id != null) return false;
        if (device != null ? !device.equals(trip.device) : trip.device != null) return false;
        if (description != null ? !description.equals(trip.description) : trip.description != null) return false;
        if (startTime != null ? !startTime.equals(trip.startTime) : trip.startTime != null) return false;
        return endTime != null ? endTime.equals(trip.endTime) : trip.endTime == null;
    }

    @Override
    public int hashCode() {
        int result = Id != null ? Id.hashCode() : 0;
        result = 31 * result + (device != null ? device.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (startTime != null ? startTime.hashCode() : 0);
        result = 31 * result + (endTime != null ? endTime.hashCode() : 0);
        return result;
    }
}
