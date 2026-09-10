package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.AuthEntity;
import com.webbasedtourguide.entities.TourPackage;
import org.springframework.data.repository.CrudRepository;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface TourPackageRepository extends CrudRepository<TourPackage, Integer> {
}