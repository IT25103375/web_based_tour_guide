package com.webbasedtourguide.dto;

import java.math.BigDecimal;
import java.time.Instant;

/** Price breakdown shown to the tourist (package card / booking page). */
public class DiscountPreviewDTO extends BasicResponse {

    private Integer packageId;
    private String packageName;
    private BigDecimal originalPrice;
    private BigDecimal discountAmount = BigDecimal.ZERO;
    private BigDecimal finalPrice;
    private Integer discountId;
    private String discountName;
    private String discountLabel;   // e.g. "15% OFF" or "LKR 2,000.00 OFF"
    private String couponCode;
    private Instant validUntil;

    public DiscountPreviewDTO() {
        super(true, "Successful");
    }

    public Integer getPackageId() { return packageId; }
    public void setPackageId(Integer packageId) { this.packageId = packageId; }
    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }
    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
    public BigDecimal getFinalPrice() { return finalPrice; }
    public void setFinalPrice(BigDecimal finalPrice) { this.finalPrice = finalPrice; }
    public Integer getDiscountId() { return discountId; }
    public void setDiscountId(Integer discountId) { this.discountId = discountId; }
    public String getDiscountName() { return discountName; }
    public void setDiscountName(String discountName) { this.discountName = discountName; }
    public String getDiscountLabel() { return discountLabel; }
    public void setDiscountLabel(String discountLabel) { this.discountLabel = discountLabel; }
    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }
    public Instant getValidUntil() { return validUntil; }
    public void setValidUntil(Instant validUntil) { this.validUntil = validUntil; }
}