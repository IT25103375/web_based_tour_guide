package com.webbasedtourguide.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

/** Tourist checks a coupon before booking. */
public class CouponValidationRequestDTO {

    @NotBlank(message = "Coupon code is required")
    @Pattern(regexp = "^[A-Za-z0-9]{4,20}$", message = "Invalid coupon code format")
    private String couponCode;

    @NotNull(message = "Package id is required")
    @Positive(message = "Package id must be positive")
    private Integer packageId;

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode == null ? null : couponCode.trim().toUpperCase();
    }

    public Integer getPackageId() { return packageId; }
    public void setPackageId(Integer packageId) { this.packageId = packageId; }
}