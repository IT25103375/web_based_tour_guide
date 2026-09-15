package com.webbasedtourguide.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class EventDetailsDTO extends BasicResponse {

    @NotNull
    private Integer eventId;
    @NotNull
    private Integer pkgId;
    @NotNull
    private String location;

    // For display purposes
    private String displayName;
    private String packageName;
    private BigDecimal price;

    public EventDetailsDTO() {
        super();
        super.setSuccess(true);
    }
    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getEventId() {
        return eventId;
    }

    public void setEventId(Integer eventId) {
        this.eventId = eventId;
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

    public Integer getPkgId() {
        return pkgId;
    }

    public void setPkgId(Integer pkgId) {
        this.pkgId = pkgId;
    }
}
