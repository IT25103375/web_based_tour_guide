package com.webbasedtourguide.entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Destination {

    @Id
    @GeneratedValue
    private Integer id;
    
    private String displayName;
    private String location;
    private String description;

    @ManyToMany(mappedBy = "offeredDestinations")
    List<TourPackage> offeredPackages = new ArrayList<>();

    @OneToMany
    @JoinColumn(name = "destination_id")
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<TourPackage> getOfferedPackages() {
        return offeredPackages;
    }

    public void setOfferedPackages(List<TourPackage> offeredPackages) {
        this.offeredPackages = offeredPackages;
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
