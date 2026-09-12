package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.TourBooking;
import com.webbasedtourguide.enums.BookingStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface BookingRepository extends CrudRepository<TourBooking, Integer> {

    @Modifying
    @Query("UPDATE TourBooking b SET b.status = :status WHERE b.id = :id")
    int updateBooking(Integer id, BookingStatus status);
}