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
@DiscriminatorValue("TOURGUIDE")
public class TourGuide extends AuthEntityDependent {

    @Id
    @GeneratedValue
    private Integer id;

    private String name;

    @Convert(converter = DayOfWeekSetConverter.class)
    private EnumSet<DayOfWeek> activeDays = EnumSet.noneOf(DayOfWeek.class);

    @Column(nullable = false)
    private GuideStatus status = GuideStatus.AVAILABLE;

    @Column(nullable = false)
    private String[] languages;

    @OneToMany
    private List<Rating> ratings;

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

    public void addRating(Rating rating) {
        ratings.add(rating);
    }

    public List<Rating> getRatings(int count) {
        return ratings.subList(0, Math.min(ratings.size(), count));
    }

    public double getRatingAvg() {
        return ratings.stream().mapToInt(Rating::getStarRating)
                .average()
                .orElse(0);
    }
}
