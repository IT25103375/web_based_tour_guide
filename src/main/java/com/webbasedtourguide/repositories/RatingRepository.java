package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.Rating;
import org.springframework.data.repository.CrudRepository;

public interface RatingRepository extends CrudRepository<Rating, Long> {
}
