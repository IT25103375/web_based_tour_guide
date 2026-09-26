package com.webbasedtourguide.dto;

import com.webbasedtourguide.entities.Destination;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

import java.math.BigDecimal;
import java.util.List;

public class TourPackageDTO {

    private Integer id;
    private String displayName;
    private BigDecimal price;
    private int duration;
    private String description;
    private int capacity;

    private List<Integer> offeredDestinationIds;

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

    public List<Integer> getOfferedDestinationIds() {
        return offeredDestinationIds;
    }

    public void setOfferedDestinationIds(List<Integer> offeredDestinationIds) {
        this.offeredDestinationIds = offeredDestinationIds;
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
