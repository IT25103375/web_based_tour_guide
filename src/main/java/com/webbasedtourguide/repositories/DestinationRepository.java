package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.AuthEntity;
import com.webbasedtourguide.entities.Destination;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface DestinationRepository extends CrudRepository<Destination, Integer> {
}