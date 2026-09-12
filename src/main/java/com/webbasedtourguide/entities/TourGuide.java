package com.webbasedtourguide.entities;

import com.webbasedtourguide.abstracts.AuthEntityDependent;
import com.webbasedtourguide.enums.GuideStatus;
import com.webbasedtourguide.mappers.DayOfWeekSetConverter;
import jakarta.persistence.*;

import java.time.DayOfWeek;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;

@Entity
public class TourGuide extends AuthEntityDependent {

    @Id
    @GeneratedValue
    private Integer id;

    private String name;

    @Convert(converter = DayOfWeekSetConverter.class)
    private EnumSet<DayOfWeek> activeDays = EnumSet.noneOf(DayOfWeek.class);

    @Column(nullable = false)
    private GuideStatus status = GuideStatus.AVAILABLE;

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
}
