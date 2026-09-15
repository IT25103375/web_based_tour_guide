package com.webbasedtourguide.enums;

public enum DiscountPriceType {
    FIXED,       // subtract a fixed LKR amount
    PERCENTAGE,  // subtract a % of the price
    INVALID      // default / not set - never accepted from the UI
}
