package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.Event;
import com.webbasedtourguide.entities.TourBooking;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

// Deliberately separate from BookingRepository (not our part) — this interface
// only covers the event-registration slice of TourBooking.
public interface EventBookingRepository extends CrudRepository<TourBooking, Integer> {

    // Confirms the booking belongs to the tourist making the request
    Optional<TourBooking> findByIdAndBooker_Id(Integer bookingId, Integer touristId);

    // Links an existing booking to an event (the actual "registration" action).
    // Only succeeds if the booking has no event already and belongs to this tourist.
    @Modifying
    @Query("UPDATE TourBooking b SET b.event = :event " +
            "WHERE b.id = :bookingId AND b.booker.id = :touristId AND b.event IS NULL")
    int registerForEvent(Integer bookingId, Event event, Integer touristId);

    // Participation count for an event
    long countByEvent_Id(Integer eventId);
}
