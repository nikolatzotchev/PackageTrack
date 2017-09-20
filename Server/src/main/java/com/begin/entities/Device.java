package com.begin.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Device {
    @Id@GeneratedValue
    private long id;

    private Position currentPosition;

}
