package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.TourBooking;
import org.springframework.data.repository.CrudRepository;

public interface BookingRepository extends CrudRepository<TourBooking, Integer> {
}