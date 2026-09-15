package com.webbasedtourguide.entities;

import com.webbasedtourguide.enums.DiscountTimeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

/** Discount that is applied only when the tourist types the code at booking/payment. */
@Entity
@DiscriminatorValue("COUPON_CODE")
public class CouponCode extends Discount {

    public CouponCode() {
        super();
        super.setDiscountTimeType(DiscountTimeType.CODE);
    }
}