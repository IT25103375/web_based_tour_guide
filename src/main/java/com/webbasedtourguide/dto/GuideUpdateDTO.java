package com.webbasedtourguide.dto;

import com.webbasedtourguide.enums.GuideStatus;

import java.time.DayOfWeek;
import java.util.List;

// The only guide fields a guide may change themselves. A null field means "leave unchanged".
public class GuideUpdateDTO {

    private List<DayOfWeek> activeDays;
    private GuideStatus status;
    private List<String> languages;

    public List<DayOfWeek> getActiveDays() {
        return activeDays;
    }

    public void setActiveDays(List<DayOfWeek> activeDays) {
        this.activeDays = activeDays;
    }

    public GuideStatus getStatus() {
        return status;
    }

    public void setStatus(GuideStatus status) {
        this.status = status;
    }

    public List<String> getLanguages() {
        return languages;
    }

    public void setLanguages(List<String> languages) {
        this.languages = languages;
    }
}
