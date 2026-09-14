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
}
