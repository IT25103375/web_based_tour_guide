package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.TourBooking;
import com.webbasedtourguide.enums.BookingStatus;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends CrudRepository<TourBooking, Integer> {

    @Modifying
    @Query("UPDATE TourBooking b SET b.status = :status WHERE b.id = :id")
    int updateBooking(Integer id, BookingStatus status);

    @Query("SELECT b FROM TourBooking b JOIN b.booker bk WHERE b.id = :bookId AND bk.id = :userId")
    Optional<TourBooking> verifyTourBooking(Integer bookId, Integer userId);

    @Query("SELECT b FROM TourBooking b JOIN b.booker bk WHERE bk.id = :userId")
    List<TourBooking> getTourBookingsById(Integer userId);
}