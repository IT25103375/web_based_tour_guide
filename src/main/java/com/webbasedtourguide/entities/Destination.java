package com.webbasedtourguide.entities;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Destination {

    @Id
    @GeneratedValue
    private Integer id;
    
    private String displayName;
    private String location;
    private String destination;

    @ManyToMany(mappedBy = "offeredDestinations")
    List<TourPackage> offeredPackages;

    @OneToMany
    private List<Rating> ratings;

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

    public List<TourPackage> getOfferedPackages() {
        return offeredPackages;
    }

    public void setOfferedPackages(List<TourPackage> offeredPackages) {
        this.offeredPackages = offeredPackages;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public void addRating(Rating rating) {
        ratings.add(rating);
    }

    public List<Rating> getRatings(int count) {
        return ratings.subList(0, Math.min(ratings.size(), count));
    }

    public int getRatingAvg() {
        return (int) ratings.stream().mapToInt(Rating::getStarRating)
                .average()
                .orElse(0);
    }
}
