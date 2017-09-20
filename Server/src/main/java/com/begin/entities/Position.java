package com.begin.entities;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.Arrays;

public class Position {
    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    private long latitude;

    @NotNull
    private long longitude;

    @NotNull
    private ZonedDateTime timestamp;

    @OneToOne
    private Trip trip;

    // optional, only if we have incident at the current position
    @OneToMany
    private Value[] incidentValues;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getLatitude() {
        return latitude;
    }

    public void setLatitude(long latitude) {
        this.latitude = latitude;
    }

    public long getLongitude() {
        return longitude;
    }

    public void setLongitude(long longitude) {
        this.longitude = longitude;
    }

    public ZonedDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(ZonedDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public Value[] getIncidentValues() {
        return incidentValues;
    }

    public void setIncidentValues(Value[] incidentValues) {
        this.incidentValues = incidentValues;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Position position = (Position) o;

        if (latitude != position.latitude) return false;
        if (longitude != position.longitude) return false;
        if (id != null ? !id.equals(position.id) : position.id != null) return false;
        if (timestamp != null ? !timestamp.equals(position.timestamp) : position.timestamp != null) return false;
        if (trip != null ? !trip.equals(position.trip) : position.trip != null) return false;
        // Probably incorrect - comparing Object[] arrays with Arrays.equals
        return Arrays.equals(incidentValues, position.incidentValues);
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (int) (latitude ^ (latitude >>> 32));
        result = 31 * result + (int) (longitude ^ (longitude >>> 32));
        result = 31 * result + (timestamp != null ? timestamp.hashCode() : 0);
        result = 31 * result + (trip != null ? trip.hashCode() : 0);
        result = 31 * result + Arrays.hashCode(incidentValues);
        return result;
    }
}
