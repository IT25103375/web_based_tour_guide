package com.webbasedtourguide.entities;

import com.webbasedtourguide.enums.DiscountPriceType;
import com.webbasedtourguide.enums.DiscountTimeType;
import jakarta.persistence.*;

@Entity
@DiscriminatorValue("TIMED_DISCOUNT")
public class TimedDiscount extends Discount {

    public TimedDiscount() {
        super();
        super.setDiscountTimeType(DiscountTimeType.TIMED);
    }
}
