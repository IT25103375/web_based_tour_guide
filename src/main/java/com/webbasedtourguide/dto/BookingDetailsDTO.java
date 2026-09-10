package com.webbasedtourguide.dto;

import com.webbasedtourguide.entities.Discount;
import com.webbasedtourguide.entities.TourGuide;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public class BookingDetailsDTO {

    @NotNull
    private Integer packageId;

    private String packageName;

    private Integer guideId;

    @NotNull
    private Instant bookedTime;

    private Discount discount;
}
