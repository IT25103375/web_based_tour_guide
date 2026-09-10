package com.webbasedtourguide.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class TourPackage {

    @Id
    @GeneratedValue
    private Integer id;

    private String displayName;
}
