package com.webbasedtourguide.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;

public class BookingDetailsDTO extends BasicResponse {

    @NotNull
    private Integer packageId;

    private Integer bookingId;

    private Integer guideId;

    @NotNull
    private Instant bookedTime;
    private String couponCode;

    // For display purposes
    private String packageName;
    private String guideName;
    private BigDecimal finalPrice;

    public BookingDetailsDTO() {
        super();
        super.setSuccess(true);
    }

    public Integer getPackageId() {
        return packageId;
    }

    public void setPackageId(Integer packageId) {
        this.packageId = packageId;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public Integer getGuideId() {
        return guideId;
    }

    public void setGuideId(Integer guideId) {
        this.guideId = guideId;
    }

    public Instant getBookedTime() {
        return bookedTime;
    }

    public void setBookedTime(Instant bookedTime) {
        this.bookedTime = bookedTime;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public String getGuideName() {
        return guideName;
    }

    public void setGuideName(String guideName) {
        this.guideName = guideName;
    }

    public BigDecimal getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(BigDecimal finalPrice) {
        this.finalPrice = finalPrice;
    }

    public Integer getBookingId() {
        return bookingId;
    }

    public void setBookingId(Integer bookingId) {
        this.bookingId = bookingId;
    }
}
