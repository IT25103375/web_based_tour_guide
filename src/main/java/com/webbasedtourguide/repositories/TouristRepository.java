package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.TourGuide;
import com.webbasedtourguide.entities.Tourist;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface TouristRepository extends CrudRepository<Tourist, Integer> {

    Optional<Tourist> findByAuthEntity_Email(String email);
}