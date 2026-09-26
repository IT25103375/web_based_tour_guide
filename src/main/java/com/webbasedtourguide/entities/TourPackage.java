package com.webbasedtourguide.entities;

import jakarta.persistence.*;
import org.jspecify.annotations.NonNull;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;

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
    private List<Destination> offeredDestinations;

    @ManyToMany
    private List<Event> offeredEvents;

    @ManyToMany
    private List<Discount> offeredDiscounts;

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
}
