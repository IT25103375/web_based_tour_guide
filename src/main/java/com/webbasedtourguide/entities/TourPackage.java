package com.webbasedtourguide.entities;

import jakarta.persistence.*;
import org.jspecify.annotations.NonNull;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Entity
public class TourPackage {

    @Id
    @GeneratedValue
    private Integer id;

    private String displayName;
    private BigDecimal price;
    private int duration;
    private String description;
    private int capacity;

    @ManyToMany
    private List<Destination> offeredDestinations = new ArrayList<>();

    @ManyToMany
    private List<Event> offeredEvents = new ArrayList<>();

    @ManyToMany
    private List<Discount> offeredDiscounts = new ArrayList<>();

    @OneToMany
    @JoinColumn(name = "tour_package_id")
    private List<Rating> ratings = new ArrayList<>();

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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public List<Destination> getOfferedDestinations() {
        return offeredDestinations;
    }

    public void setOfferedDestinations(List<Destination> offeredDestinations) {
        this.offeredDestinations = offeredDestinations;
    }

    public void addDestination(Destination destination) {
        this.offeredDestinations.add(destination);
    }

    public void removeDestination(Destination o) {
        this.offeredDestinations.remove(o);
    }

    public void addAllDestinations(@NonNull Collection<? extends Destination> c) {
        this.offeredDestinations.addAll(c);
    }

    public List<Event> getOfferedEvents() {
        return offeredEvents;
    }

    public void setOfferedEvents(List<Event> offeredEvents) {
        this.offeredEvents = offeredEvents;
    }

    public void addEvent(Event event) {
        if (!this.offeredEvents.contains(event)) this.offeredEvents.add(event);
    }

    public void removeEvent(Event event) {
        this.offeredEvents.remove(event);
    }

    public List<Discount> getOfferedDiscounts() {
        return offeredDiscounts;
    }

    public void setOfferedDiscounts(List<Discount> offeredDiscounts) {
        this.offeredDiscounts = offeredDiscounts;
    }

    public void addDiscount(Discount discount) {
        if (!this.offeredDiscounts.contains(discount)) this.offeredDiscounts.add(discount);
    }

    public void removeDiscount(Discount discount) {
        this.offeredDiscounts.remove(discount);
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public void addRating(Rating rating) {
        ratings.add(rating);
    }

    public List<Rating> getRatings(int count) {
        return ratings.subList(0, Math.min(ratings.size(), count));
    }

    public double getRatingAvg() {
        return (int) ratings.stream().mapToInt(Rating::getStarRating)
                .average()
                .orElse(0);
    }
}
