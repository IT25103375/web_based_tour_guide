package com.webbasedtourguide.entities;

import com.webbasedtourguide.enums.DiscountPriceType;
import com.webbasedtourguide.enums.DiscountTimeType;
import jakarta.persistence.*;
import org.jspecify.annotations.NonNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collection;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "discount_type", discriminatorType = DiscriminatorType.STRING)
public class Discount {

    @Id
    @GeneratedValue
    private Integer id;

    @OneToMany
    @JoinColumn(nullable = false)
    private List<TourPackage> applicablePackages;

    private String couponCode;

    private BigDecimal percentage;
    private BigDecimal fixed;

    @Column(nullable = false)
    private DiscountPriceType discountPriceType = DiscountPriceType.INVALID;

    @Column(nullable = false)
    private DiscountTimeType discountTimeType = DiscountTimeType.INVALID;

    @Column(nullable = false)
    private Instant startDate;
    @Column(nullable = false)
    private Instant endDate;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public BigDecimal getPercentage() {
        return percentage;
    }

    public void setPercentage(BigDecimal percentage) {
        this.percentage = percentage;
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

    public List<TourPackage> getApplicablePackages() {
        return applicablePackages;
    }

    public void remove(Object o) {
        this.applicablePackages.remove(o);
    }

    public void add(TourPackage tourPackage) {
        this.applicablePackages.add(tourPackage);
    }

    public void addAll(@NonNull Collection<? extends TourPackage> c) {
        this.applicablePackages.addAll(c);
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }
}
