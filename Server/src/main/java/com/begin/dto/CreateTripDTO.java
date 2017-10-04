package com.begin.dto;

import java.util.Objects;
import javax.validation.constraints.NotNull;

public class CreateTripDTO {

  private String description;

  @NotNull
  private Long deviceId;

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Long getDeviceId() {
    return deviceId;
  }

  public void setDeviceId(Long deviceId) {
    this.deviceId = deviceId;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    CreateTripDTO that = (CreateTripDTO) o;
    return Objects.equals(description, that.description) &&
        Objects.equals(deviceId, that.deviceId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(description, deviceId);
  }
}
