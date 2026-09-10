package com.webbasedtourguide.enums;

import com.webbasedtourguide.repositories.TouristRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;

public enum UserType {
    TOURIST,
    TOURGUIDE,
    AGENCYSTAFF,
    TOURMANAGER
}
