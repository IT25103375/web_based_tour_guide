package com.webbasedtourguide.entities;

import com.webbasedtourguide.abstracts.AuthEntityDependent;
import jakarta.persistence.*;

@Entity
public class Tourist extends AuthEntityDependent {

    @Id
    @GeneratedValue
    private Integer id;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
