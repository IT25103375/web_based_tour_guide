package com.webbasedtourguide.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class EventControlDTO extends BasicResponse {

    @NotNull
    private Integer eventId;
    @NotNull
    private Integer bookingId;
    @NotNull
    private String location;
    @NotNull
    private Instant startDate;
    @NotNull
    private Instant endDate;

    @NotEmpty
    List<Integer> applicablePackages;

    private String eventName;
    private BigDecimal price;
    private Integer capacity;

    public EventControlDTO() {
        super();
        super.setSuccess(true);
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getBookingId() {
        return bookingId;
    }

    public void setBookingId(Integer bookingId) {
        this.bookingId = bookingId;
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

    public List<Integer> getApplicablePackages() {
        return applicablePackages;
    }

    public void setApplicablePackages(List<Integer> applicablePackages) {
        this.applicablePackages = applicablePackages;
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

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
}