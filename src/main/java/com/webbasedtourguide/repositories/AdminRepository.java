package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.Admin;
import com.webbasedtourguide.entities.TourGuide;
import org.springframework.data.repository.CrudRepository;

public interface AdminRepository extends CrudRepository<Admin, Integer> {
}