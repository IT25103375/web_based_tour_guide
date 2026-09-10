package com.webbasedtourguide.entities;

import com.webbasedtourguide.enums.DiscountType;
import jakarta.persistence.*;

import java.math.BigDecimal;

@MappedSuperclass
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class Discount {

    @Id
    @GeneratedValue
    private Integer id;

    private BigDecimal percentage;
    private BigDecimal fixed;

    @Column(nullable = false)
    private DiscountType discountType = DiscountType.INVALID;
}
