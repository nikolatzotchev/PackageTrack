package com.begin.entities;

import com.begin.Range;

import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Entity
public class ValueRange {

    @OneToOne
    private Trip Id;

    private Range<Double> temprange;

    private Range<Double> humidyrange;

    public Range<Double> getTemprange() {
        return temprange;
    }

    public void setTemprange(Range<Double> temprange) {
        this.temprange = temprange;
    }

    public Range<Double> getHumidyrange() {
        return humidyrange;
    }

    public void setHumidyrange(Range<Double> humidyrange) {
        this.humidyrange = humidyrange;
    }
}
