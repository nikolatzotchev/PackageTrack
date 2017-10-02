package com.begin;

public class Range<T extends Comparable<T>>{
    private T minimum;
    private T maximum;

    public Range(T min, T max){
        this.minimum = min;
        this.maximum = max;
    }

    public Range(T max) {
        this.maximum = max;
    }

    public T getMinimum() {
        return minimum;
    }

    public void setMinimum(T minimum) {
        this.minimum = minimum;
    }

    public T getMaximum() {
        return maximum;
    }

    public void setMaximum(T maximum) {
        this.maximum = maximum;
    }

    public boolean contains(T value) {
        if (value.compareTo(getMinimum()) >= 0 && value.compareTo(getMaximum()) <= 0) {
            return true;
        }
        return false;
    }
}
