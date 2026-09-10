package com.webbasedtourguide.entities;

import com.webbasedtourguide.enums.BookingStatus;
import jakarta.persistence.Column;

import java.time.Instant;

public class TourBooking {

    @Column(nullable = false)
    private BookingStatus status = BookingStatus.UNCONFIRMED;

    private Instant bookedDate;

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public Instant getBookedDate() {
        return bookedDate;
    }

    public void setBookedDate(Instant bookedDate) {
        this.bookedDate = bookedDate;
    }
}
