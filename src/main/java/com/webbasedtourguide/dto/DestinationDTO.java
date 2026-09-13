package com.webbasedtourguide.dto;

import java.util.List;

public class DestinationDTO {

    private Integer id;
    private String displayName;
    private String location;
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

    public List<Integer> getOfferedPackageIds() {
        return offeredPackageIds;
    }

    public void setOfferedPackageIds(List<Integer> offeredPackageIds) {
        this.offeredPackageIds = offeredPackageIds;
    }
}
