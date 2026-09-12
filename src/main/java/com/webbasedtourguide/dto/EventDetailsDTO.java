package com.webbasedtourguide.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class EventDetailsDTO extends BasicResponse {

    @NotNull
    private Integer eventId;
    @NotNull
    private Integer pkgId;
    @NotNull
    private String location;

    // For display purposes
    private String eventName;
    private String packageName;
    private BigDecimal finalPrice;

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

    public BigDecimal getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(BigDecimal finalPrice) {
        this.finalPrice = finalPrice;
    }

    public Integer getEventId() {
        return eventId;
    }

    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
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
