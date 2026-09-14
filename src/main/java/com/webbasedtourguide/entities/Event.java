package com.webbasedtourguide.entities;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
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
    private List<TourPackage> applicablePackages;

    @Column(nullable = false)
    private Instant startDate = Instant.now();
    @Column(nullable = false)
    private Instant endDate;

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
}
