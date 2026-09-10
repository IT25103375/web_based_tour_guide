package com.webbasedtourguide.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.time.Instant;

@Entity
public class Event {

    @Id
    @GeneratedValue
    private Integer id;
    
    private String displayName;
    private String location;

    @Column(nullable = false)
    private Instant startDate = Instant.now();
    @Column(nullable = false)
    private Instant endDate;

}
