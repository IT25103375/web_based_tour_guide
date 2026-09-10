package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.Discount;
import com.webbasedtourguide.entities.Event;
import org.springframework.data.repository.CrudRepository;

public interface DiscountRepository extends CrudRepository<Discount, Integer> {
}