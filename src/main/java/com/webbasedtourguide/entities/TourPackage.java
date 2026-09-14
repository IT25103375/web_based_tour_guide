package com.webbasedtourguide.entities;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
public class TourPackage {

    @Id
    @GeneratedValue
    private Integer id;

    private String displayName;
    private BigDecimal price;

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
}
