package com.webbasedtourguide.entities;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
public class EventRegistration {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    // ASSUMPTION: entity is named "Tourist" with an Integer id — confirm against Tourist.java
    @ManyToOne
    @JoinColumn(name = "tourist_id", nullable = false)
    private Tourist tourist;

    // ASSUMPTION: entity is named "TourBooking" — confirm against TourBooking.java.
    // This links the registration to the specific booking that made the tourist eligible.
    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private TourBooking booking;

    @Column(nullable = false)
    private Instant registeredAt = Instant.now();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Tourist getTourist() {
        return tourist;
    }

    public void setTourist(Tourist tourist) {
        this.tourist = tourist;
    }

    public TourBooking getBooking() {
        return booking;
    }

    public void setBooking(TourBooking booking) {
        this.booking = booking;
    }

    public Instant getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(Instant registeredAt) {
        this.registeredAt = registeredAt;
    }
}
