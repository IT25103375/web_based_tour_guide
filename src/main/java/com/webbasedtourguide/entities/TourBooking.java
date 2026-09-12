package com.webbasedtourguide.entities;

import com.webbasedtourguide.enums.BookingStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
public class TourBooking {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(nullable = false)
    private TourPackage tourPackage;

    @ManyToOne
    @JoinColumn(nullable = false)
    private TourGuide guide;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Discount discount;

    @Column(nullable = false)
    private BookingStatus status = BookingStatus.UNCONFIRMED;

    @Column(nullable = false)
    private BigDecimal finalPrice;

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

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public TourPackage getTourPackage() {
        return tourPackage;
    }

    public void setTourPackage(TourPackage tourPackage) {
        this.tourPackage = tourPackage;
    }

    public TourGuide getGuide() {
        return guide;
    }

    public void setGuide(TourGuide guide) {
        this.guide = guide;
    }

    public Discount getDiscount() {
        return discount;
    }

    public void setDiscount(Discount discount) {
        this.discount = discount;
    }

    public BigDecimal getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(BigDecimal finalPrice) {
        this.finalPrice = finalPrice;
    }
}
