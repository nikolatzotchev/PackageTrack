package com.begin.entities;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;

public class Position {
    @Id
    @GeneratedValue
    private long id;

    @NotNull
    private long latitude;

    @NotNull
    private long longitude;

    @NotNull
    private ZonedDateTime timestamp;

    @NotNull // FIXME: add link to trip
    private long tripId;

    // optional, only if we have incident at the current position
    private Value[] incidentValues;
}
