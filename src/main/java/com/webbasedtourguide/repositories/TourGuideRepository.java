package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.TourGuide;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.Optional;

public interface TourGuideRepository extends CrudRepository<TourGuide, Integer> {

    Optional<TourGuide> findByAuthEntity_Email(String email);
}