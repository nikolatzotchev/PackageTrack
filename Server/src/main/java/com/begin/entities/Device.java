package com.begin.entities;

import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
public class Device {

  @Id
  @GeneratedValue
  private Long id;

  @NotNull
  @Column(unique = true)
  @Size(max = 50)
  private String serialNo;

  public String getSerialNo() {
    return serialNo;
  }

  public void setSerialNo(String serialNo) {
    this.serialNo = serialNo;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Device device = (Device) o;
    return Objects.equals(id, device.id) &&
        Objects.equals(serialNo, device.serialNo);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, serialNo);
  }
}
