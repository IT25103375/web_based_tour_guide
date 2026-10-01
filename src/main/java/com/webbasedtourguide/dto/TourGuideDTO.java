package com.webbasedtourguide.dto;

import com.webbasedtourguide.abstracts.AuthEntityDependent;
import com.webbasedtourguide.entities.Rating;
import com.webbasedtourguide.enums.GuideStatus;
import com.webbasedtourguide.mappers.DayOfWeekSetConverter;
import jakarta.persistence.*;

import java.time.DayOfWeek;
import java.util.EnumSet;
import java.util.List;

public class TourGuideDTO extends AuthEntityDependent {

    private Integer id;
    private String name;
    private EnumSet<DayOfWeek> activeDays;
    private GuideStatus status;
    private String[] languages;
    // Out of 5
    private double avgRating;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean getDayAvailability(DayOfWeek day) {
        return activeDays.contains(day);
    }

    public void setDayAvailability(List<DayOfWeek> days, boolean active) {
        if (active) activeDays.addAll(days);
        else days.forEach(activeDays::remove);
    }

    public GuideStatus getStatus() {
        return status;
    }

    public void setStatus(GuideStatus status) {
        this.status = status;
    }

    public String[] getLanguages() {
        return languages;
    }

    public void setLanguages(String[] languages) {
        this.languages = languages;
    }

    public double getAvgRating() {
        return avgRating;
    }

    public void setAvgRating(double avgRating) {
        this.avgRating = avgRating;
    }
}
