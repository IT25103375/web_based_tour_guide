package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.AuthEntity;
import com.webbasedtourguide.entities.Destination;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface DestinationRepository extends CrudRepository<Destination, Integer> {
}