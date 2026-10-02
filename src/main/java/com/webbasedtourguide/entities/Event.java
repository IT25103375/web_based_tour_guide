package com.webbasedtourguide.entities;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Event {

    @Id
    @GeneratedValue
    private Integer id;

    private String displayName;
    @Column(nullable = false)
    private String location;
    @Column(nullable = false)
    private BigDecimal price;

    @ManyToMany(mappedBy = "offeredEvents")
    private List<TourPackage> applicablePackages = new ArrayList<>();

    @Column(nullable = false)
    private Instant startDate = Instant.now();
    @Column(nullable = false)
    private Instant endDate;

    private Integer capacity;
    private String description;

    @OneToMany
    @JoinColumn(name = "event_id")
    private List<Rating> ratings = new ArrayList<>();

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Instant getStartDate() {
        return startDate;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Instant getEndDate() {
        return endDate;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public List<TourPackage> getApplicablePackages() {
        return applicablePackages;
    }

    public void setApplicablePackages(List<TourPackage> applicablePackages) {
        this.applicablePackages = applicablePackages;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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