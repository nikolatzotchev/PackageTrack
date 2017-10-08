package com.begin.entities;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;

@Entity
public class Report {

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
  private List<Value> incidentValues;

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

  public List<Value> getIncidentValues() {
    return incidentValues;
  }

  public void setIncidentValues(List<Value> incidentValues) {
    this.incidentValues = incidentValues;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Report position = (Report) o;
    return latitude == position.latitude &&
        longitude == position.longitude &&
        Objects.equals(id, position.id) &&
        Objects.equals(timestamp, position.timestamp) &&
        Objects.equals(trip, position.trip) &&
        Objects.equals(incidentValues, position.incidentValues);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, latitude, longitude, timestamp, trip, incidentValues);
  }
}