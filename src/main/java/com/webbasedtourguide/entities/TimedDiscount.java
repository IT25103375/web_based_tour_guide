package com.webbasedtourguide.entities;

import com.webbasedtourguide.enums.DiscountTimeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

/** Discount that is applied automatically to its packages between startDate and endDate. */
@Entity
@DiscriminatorValue("TIMED_DISCOUNT")
public class TimedDiscount extends Discount {

    public TimedDiscount() {
        super();
        super.setDiscountTimeType(DiscountTimeType.TIMED);
    }
}