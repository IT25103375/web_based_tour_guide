package com.webbasedtourguide.dto;

import com.webbasedtourguide.enums.DiscountPriceType;
import com.webbasedtourguide.enums.DiscountTimeType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;

/**
 * Body for CREATE (POST) and UPDATE (PUT).
 * Field-level rules  -> annotations.
 * Cross-field rules  -> @AssertTrue methods (run by the same @Valid call).
 * Database rules     -> DiscountService (package exists, coupon unique...).
 */
public class DiscountRequestDTO {

    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 100, message = "Name must be 3-100 characters")
    private String name;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    @NotNull(message = "Discount type is required (TIMED or CODE)")
    private DiscountTimeType discountType;

    @NotNull(message = "Price type is required (FIXED or PERCENTAGE)")
    private DiscountPriceType priceType;

    @DecimalMin(value = "0.01", message = "Percentage must be at least 0.01")
    @DecimalMax(value = "100.00", message = "Percentage cannot exceed 100")
    @Digits(integer = 3, fraction = 2, message = "Percentage can have max 2 decimal places")
    private BigDecimal percentage;

    @DecimalMin(value = "0.01", message = "Fixed amount must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Fixed amount can have max 2 decimal places")
    private BigDecimal fixedAmount;

    @Pattern(regexp = "^[A-Za-z0-9]{4,20}$",
            message = "Coupon code must be 4-20 letters/numbers, no spaces or symbols")
    private String couponCode;

    @NotNull(message = "Start date is required")
    private Instant startDate;

    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    private Instant endDate;

    @Min(value = 1, message = "Usage limit must be at least 1")
    @Max(value = 100000, message = "Usage limit cannot exceed 100000")
    private Integer usageLimit;

    @NotEmpty(message = "Select at least one tour package")
    @Size(max = 100, message = "Too many packages selected")
    private List<@NotNull(message = "Package id cannot be null")
    @Positive(message = "Package id must be positive") Integer> packageIds;

    private Boolean active = true;

    // ================= cross-field validations =================

    @AssertTrue(message = "End date must be after start date")
    public boolean isDateRangeValid() {
        if (startDate == null || endDate == null) return true; // @NotNull handles nulls
        return endDate.isAfter(startDate);
    }

    @AssertTrue(message = "Discount type must be TIMED or CODE")
    public boolean isDiscountTypeValid() {
        return discountType != DiscountTimeType.INVALID;
    }

    @AssertTrue(message = "PERCENTAGE needs only a percentage value; FIXED needs only a fixed amount")
    public boolean isPriceValueValid() {
        if (priceType == null) return true;
        return switch (priceType) {
            case PERCENTAGE -> percentage != null && fixedAmount == null;
            case FIXED -> fixedAmount != null && percentage == null;
            case INVALID -> false;
        };
    }

    @AssertTrue(message = "Coupon code is required for CODE discounts and must be empty for TIMED discounts")
    public boolean isCouponCodeValid() {
        if (discountType == null) return true;
        boolean hasCode = couponCode != null;
        return discountType == DiscountTimeType.CODE ? hasCode : !hasCode;
    }

    @AssertTrue(message = "Usage limit can only be set for coupon codes")
    public boolean isUsageLimitValid() {
        return usageLimit == null || discountType == DiscountTimeType.CODE;
    }

    @AssertTrue(message = "Duplicate package ids are not allowed")
    public boolean isPackageIdsUnique() {
        return packageIds == null || new HashSet<>(packageIds).size() == packageIds.size();
    }

    // ================= getters / setters (with trimming) =================

    public String getName() { return name; }
    public void setName(String name) { this.name = name == null ? null : name.trim(); }

    public String getDescription() { return description; }
    public void setDescription(String description) {
        this.description = (description == null || description.isBlank()) ? null : description.trim();
    }

    public DiscountTimeType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountTimeType discountType) { this.discountType = discountType; }

    public DiscountPriceType getPriceType() { return priceType; }
    public void setPriceType(DiscountPriceType priceType) { this.priceType = priceType; }

    public BigDecimal getPercentage() { return percentage; }
    public void setPercentage(BigDecimal percentage) { this.percentage = percentage; }

    public BigDecimal getFixedAmount() { return fixedAmount; }
    public void setFixedAmount(BigDecimal fixedAmount) { this.fixedAmount = fixedAmount; }

    public String getCouponCode() { return couponCode; }
    /** "" becomes null, " summer25 " becomes "SUMMER25". */
    public void setCouponCode(String couponCode) {
        this.couponCode = (couponCode == null || couponCode.isBlank())
                ? null : couponCode.trim().toUpperCase();
    }

    public Instant getStartDate() { return startDate; }
    public void setStartDate(Instant startDate) { this.startDate = startDate; }

    public Instant getEndDate() { return endDate; }
    public void setEndDate(Instant endDate) { this.endDate = endDate; }

    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

    public List<Integer> getPackageIds() { return packageIds; }
    public void setPackageIds(List<Integer> packageIds) { this.packageIds = packageIds; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}