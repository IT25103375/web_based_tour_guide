package com.webbasedtourguide.dto;

import jakarta.validation.constraints.NotNull;

/** Body for PATCH /api/discounts/{id}/status  ->  { "active": false } */
public class DiscountStatusDTO {

    @NotNull(message = "active must be true or false")
    private Boolean active;

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}