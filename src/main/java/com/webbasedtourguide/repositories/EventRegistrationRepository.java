package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.EventRegistration;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface EventRegistrationRepository extends CrudRepository<EventRegistration, Integer> {

    // Used for the "update participation count" step in the use case scenario
    long countByEvent_Id(Integer eventId);

    // Used to stop a tourist registering twice for the same event
    boolean existsByEvent_IdAndTourist_Id(Integer eventId, Integer touristId);

    List<EventRegistration> findByTourist_Id(Integer touristId);
}
