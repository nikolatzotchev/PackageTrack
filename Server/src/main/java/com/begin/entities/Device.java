package com.begin.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Device {

    @Id@GeneratedValue
    private Long id;

    private Boolean assigned;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getAssign() {
        return assigned;
    }

    public void setAssign(Boolean assign) {
        this.assigned = assign;
    }
}
