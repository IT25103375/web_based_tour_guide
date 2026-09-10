package com.webbasedtourguide.dto;

import com.webbasedtourguide.deserializers.LowerCaseDeserialize;
import jakarta.validation.constraints.NotBlank;
import tools.jackson.databind.annotation.JsonDeserialize;

public class LoginRequest {

    @NotBlank
    @JsonDeserialize(converter = LowerCaseDeserialize.class)
    private String email;

    @NotBlank
    private String password;

    @JsonDeserialize(converter = LowerCaseDeserialize.class)
    public String getEmail() {
        return email;
    }

    @JsonDeserialize(converter = LowerCaseDeserialize.class)
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
