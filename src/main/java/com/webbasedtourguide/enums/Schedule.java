package com.webbasedtourguide.enums;

import java.util.EnumMap;

public enum Schedule {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY;

    final EnumMap<Schedule, Boolean> weekMap = new EnumMap<>(Schedule.class);

    public boolean getDay(Schedule day) {
        return weekMap.get(day);
    }

    public void setDay(Schedule day, boolean available) {
        weekMap.put(day, available);
    }
}