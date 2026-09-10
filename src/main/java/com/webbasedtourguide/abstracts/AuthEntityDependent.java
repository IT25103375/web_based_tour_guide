package com.webbasedtourguide.abstracts;

import com.webbasedtourguide.entities.AuthEntity;
import jakarta.persistence.*;

@MappedSuperclass
public abstract class AuthEntityDependent {

    @OneToOne(optional = false)
    @JoinColumn(nullable = false, unique = true)
    private AuthEntity authEntity;

    public AuthEntity getAuthEntity() {
        return authEntity;
    }

    public void setAuthEntity(AuthEntity authEntity) {
        this.authEntity = authEntity;
    }
}
