package com.begin.entities;

import java.time.ZonedDateTime;
import java.util.Objects;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.Size;

@Entity
public class Trip {

  @Id
  @GeneratedValue
  private Long id;

  @ManyToOne
  private Device device;

  @Size(max = 1500)
  private String description;

  private ZonedDateTime startTime;

  private ZonedDateTime endTime;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

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
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Trip trip = (Trip) o;
    return Objects.equals(id, trip.id) &&
        Objects.equals(device, trip.device) &&
        Objects.equals(description, trip.description) &&
        Objects.equals(startTime, trip.startTime) &&
        Objects.equals(endTime, trip.endTime);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, device, description, startTime, endTime);
  }
}
