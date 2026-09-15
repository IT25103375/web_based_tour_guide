package com.webbasedtourguide.dto;

import com.webbasedtourguide.enums.DiscountPriceType;
import com.webbasedtourguide.enums.DiscountTimeType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/** What the API sends back. Never return the entity itself (avoids infinite JSON loops). */
public class DiscountResponseDTO {

    private Integer id;
    private String name;
    private String description;
    private DiscountTimeType discountType;
    private DiscountPriceType priceType;
    private BigDecimal percentage;
    private BigDecimal fixedAmount;
    private String couponCode;
    private Instant startDate;
    private Instant endDate;
    private Integer usageLimit;
    private long timesUsed;
    private boolean active;
    private String status;              // ACTIVE / SCHEDULED / EXPIRED / DISABLED
    private List<PackageSummaryDTO> packages;
    private Instant createdAt;
    private Instant updatedAt;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public DiscountTimeType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountTimeType discountType) { this.discountType = discountType; }
    public DiscountPriceType getPriceType() { return priceType; }
    public void setPriceType(DiscountPriceType priceType) { this.priceType = priceType; }
    public BigDecimal getPercentage() { return percentage; }
    public void setPercentage(BigDecimal percentage) { this.percentage = percentage; }
    public BigDecimal getFixedAmount() { return fixedAmount; }
    public void setFixedAmount(BigDecimal fixedAmount) { this.fixedAmount = fixedAmount; }
    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }
    public Instant getStartDate() { return startDate; }
    public void setStartDate(Instant startDate) { this.startDate = startDate; }
    public Instant getEndDate() { return endDate; }
    public void setEndDate(Instant endDate) { this.endDate = endDate; }
    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }
    public long getTimesUsed() { return timesUsed; }
    public void setTimesUsed(long timesUsed) { this.timesUsed = timesUsed; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<PackageSummaryDTO> getPackages() { return packages; }
    public void setPackages(List<PackageSummaryDTO> packages) { this.packages = packages; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}