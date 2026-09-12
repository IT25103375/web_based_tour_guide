package com.webbasedtourguide.entities;

import com.webbasedtourguide.enums.DiscountTimeType;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("COUPON_CODE")
public class CouponCode extends Discount {

    public CouponCode() {
        super();
        super.setDiscountTimeType(DiscountTimeType.CODE);
    }
}
