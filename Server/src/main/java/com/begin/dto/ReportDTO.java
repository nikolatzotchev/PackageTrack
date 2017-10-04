package com.begin.dto;

import com.begin.entities.Value;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;

public class ReportDTO {

  private long latitude;

  private long longitude;

  private ZonedDateTime timestamp;

  // optional, only if we have incident at the current position
  private List<Value> incidentValues;

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
    ReportDTO reportDTO = (ReportDTO) o;
    return latitude == reportDTO.latitude &&
        longitude == reportDTO.longitude &&
        Objects.equals(timestamp, reportDTO.timestamp) &&
        Objects.equals(incidentValues, reportDTO.incidentValues);
  }

  @Override
  public int hashCode() {
    return Objects.hash(latitude, longitude, timestamp, incidentValues);
  }

}
