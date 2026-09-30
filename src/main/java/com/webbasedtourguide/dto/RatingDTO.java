package com.webbasedtourguide.dto;

import com.webbasedtourguide.enums.RatingType;

public class RatingDTO {

    private int rating;
    private String message;
    private RatingType type;
    // TODO: fix rating type shaky logic
    private int typeId;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public RatingType getType() {
        return type;
    }

    public void setType(RatingType type) {
        this.type = type;
    }

    public int getTypeId() {
        return typeId;
    }

    public void setTypeId(int typeId) {
        this.typeId = typeId;
    }
}
