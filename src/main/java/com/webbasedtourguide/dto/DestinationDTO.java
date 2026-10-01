package com.webbasedtourguide.dto;

import java.util.List;

public class DestinationDTO {

    private Integer id;
    private String displayName;
    private String location;
    private String description;
    private int avgRating;
    private List<Integer> offeredPackageIds;

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

    public int getAvgRating() {
        return avgRating;
    }

    public void setAvgRating(int avgRating) {
        this.avgRating = avgRating;
    }

    public List<Integer> getOfferedPackageIds() {
        return offeredPackageIds;
    }

    public void setOfferedPackageIds(List<Integer> offeredPackageIds) {
        this.offeredPackageIds = offeredPackageIds;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
