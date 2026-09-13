package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.AuthEntity;
import com.webbasedtourguide.entities.TourPackage;
import org.springframework.data.repository.CrudRepository;

public interface TourPackageRepository extends CrudRepository<TourPackage, Integer> {
}