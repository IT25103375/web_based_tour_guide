package com.webbasedtourguide.entities;

import com.webbasedtourguide.enums.DiscountPriceType;
import com.webbasedtourguide.enums.DiscountTimeType;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Base discount entity.
 * SINGLE_TABLE inheritance -> TimedDiscount and CouponCode are stored in ONE table ("discount"),
 * separated by the "discount_type" column (TIMED_DISCOUNT / COUPON_CODE).
 */
@Entity
@Table(name = "discount")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "discount_type", discriminatorType = DiscriminatorType.STRING)
public class Discount {

    @Id
    @GeneratedValue
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 255)
    private String description;

    // TourPackage owns the relationship (TourPackage.offeredDiscounts).
    // Always change it through TourPackage.addDiscount()/removeDiscount().
    @ManyToMany(mappedBy = "offeredDiscounts")
    private List<TourPackage> applicablePackages = new ArrayList<>();

    // Only used by CouponCode rows. Stored in UPPER CASE. NULL for timed discounts.
    @Column(unique = true, length = 20)
    private String couponCode;

    // 0.01 - 100.00 (means percent, e.g. 15 = 15%)
    @Column(precision = 5, scale = 2)
    private BigDecimal percentage;

    // Fixed amount in LKR
    @Column(precision = 12, scale = 2)
    private BigDecimal fixed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DiscountPriceType discountPriceType = DiscountPriceType.INVALID;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DiscountTimeType discountTimeType = DiscountTimeType.INVALID;

    @Column(nullable = false)
    private Instant startDate;

    @Column(nullable = false)
    private Instant endDate;

    // Coupons only: max number of (non-cancelled) bookings that can use it. NULL = unlimited.
    private Integer usageLimit;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    /** True when the discount can be used right now. */
    public boolean isCurrentlyValid() {
        Instant now = Instant.now();
        return active
                && discountPriceType != DiscountPriceType.INVALID
                && discountTimeType != DiscountTimeType.INVALID
                && !startDate.isAfter(now)
                && !endDate.isBefore(now);
    }

    // ---------- getters / setters ----------

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<TourPackage> getApplicablePackages() { return applicablePackages; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public BigDecimal getPercentage() { return percentage; }
    public void setPercentage(BigDecimal percentage) { this.percentage = percentage; }

    public BigDecimal getFixed() { return fixed; }
    public void setFixed(BigDecimal fixed) { this.fixed = fixed; }

    public DiscountPriceType getDiscountPriceType() { return discountPriceType; }
    public void setDiscountPriceType(DiscountPriceType discountPriceType) { this.discountPriceType = discountPriceType; }

    public DiscountTimeType getDiscountTimeType() { return discountTimeType; }
    public void setDiscountTimeType(DiscountTimeType discountTimeType) { this.discountTimeType = discountTimeType; }

    public Instant getStartDate() { return startDate; }
    public void setStartDate(Instant startDate) { this.startDate = startDate; }

    public Instant getEndDate() { return endDate; }
    public void setEndDate(Instant endDate) { this.endDate = endDate; }

    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}