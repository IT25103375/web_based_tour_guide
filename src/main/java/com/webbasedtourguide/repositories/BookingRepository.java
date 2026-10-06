package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.TourBooking;
import com.webbasedtourguide.enums.BookingStatus;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends CrudRepository<TourBooking, Integer> {

    @Modifying
    @Query("UPDATE TourBooking b SET b.status = :status WHERE b.id = :id")
    int updateBooking(Integer id, BookingStatus status);

    @Query("SELECT b FROM TourBooking b JOIN b.booker bk WHERE b.id = :bookId AND bk.id = :userId")
    Optional<TourBooking> verifyTourBooking(Integer bookId, Integer userId);

    long countByGuide_IdAndStatus(Integer guideId, BookingStatus status);

    // Guides who already have an active booking on this exact tour date
    @Query("SELECT b.guide.id FROM TourBooking b WHERE b.status = :status AND b.bookedDate = :date")
    List<Integer> getGuideIdsBookedOn(Instant date, BookingStatus status);

    long countByEvent_IdAndStatusNot(Integer eventId, BookingStatus status);

    @Query("SELECT b FROM TourBooking b JOIN b.booker bk WHERE bk.id = :userId ORDER BY b.bookedDate DESC")
    List<TourBooking> getTourBookingsById(Integer userId);
}