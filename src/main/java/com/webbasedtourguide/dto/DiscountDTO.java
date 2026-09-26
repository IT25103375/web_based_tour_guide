package com.webbasedtourguide.dto;

import com.webbasedtourguide.enums.DiscountPriceType;
import com.webbasedtourguide.enums.DiscountTimeType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class DiscountDTO {

    private Integer id;
    private String couponCode;
    private BigDecimal percentage;
    private BigDecimal fixed;
    private BigDecimal minAmount;
    private DiscountPriceType discountPriceType;
    private DiscountTimeType discountTimeType;
    private Instant startDate;
    private Instant endDate;

    private List<Integer> applicablePackagesIds;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public BigDecimal getPercentage() {
        return percentage;
    }

    public void setPercentage(BigDecimal percentage) {
        this.percentage = percentage;
    }

    public BigDecimal getMinAmount() {
        return minAmount;
    }

    public void setMinAmount(BigDecimal minAmount) {
        this.minAmount = minAmount;
    }

    public BigDecimal getFixed() {
        return fixed;
    }

    public void setFixed(BigDecimal fixed) {
        this.fixed = fixed;
    }

    public DiscountPriceType getDiscountPriceType() {
        return discountPriceType;
    }

    public void setDiscountPriceType(DiscountPriceType discountPriceType) {
        this.discountPriceType = discountPriceType;
    }

    public DiscountTimeType getDiscountTimeType() {
        return discountTimeType;
    }

    public void setDiscountTimeType(DiscountTimeType discountTimeType) {
        this.discountTimeType = discountTimeType;
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

    public List<Integer> getApplicablePackagesIds() {
        return applicablePackagesIds;
    }

    public void setApplicablePackagesIds(List<Integer> applicablePackagesIds) {
        this.applicablePackagesIds = applicablePackagesIds;
    }
}