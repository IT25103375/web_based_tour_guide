package com.webbasedtourguide.dto;

import com.webbasedtourguide.enums.UserType;

public class UserAdminDTO {

    private Integer id;
    private String username;
    private String email;
    private UserType userType;

    public UserAdminDTO() {
    }

    public UserAdminDTO(Integer id, String username, String email, UserType userType) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.userType = userType;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }
}