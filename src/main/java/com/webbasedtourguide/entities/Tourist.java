package com.webbasedtourguide.entities;

import jakarta.persistence.*;

@Entity
public class Tourist {

    @Id
    @GeneratedValue
    private Integer id;

    @OneToOne(optional = false)
    @JoinColumn(nullable = false, unique = true)
    private AuthEntity authEntity;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public AuthEntity getAuthEntity() {
        return authEntity;
    }

    public void setAuthEntity(AuthEntity authEntity) {
        this.authEntity = authEntity;
    }
}
