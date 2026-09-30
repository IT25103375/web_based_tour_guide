package com.webbasedtourguide.entities;

import com.webbasedtourguide.enums.RatingType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Rating extends UserMessage {

    public final static int RATINGMAX = 5;

    private int starRating;
    private RatingType type;

    public Rating() {
        super();
    }

    public Rating(AuthEntity sender, String content, int starRating, RatingType type) {
        super(sender, content);
        this.starRating = starRating;
        this.type = type;
    }

    public int getStarRating() {
        return starRating;
    }

    public void setStarRating(int starRating) {
        this.starRating = starRating;
    }

    public RatingType getType() {
        return type;
    }

    public void setType(RatingType type) {
        this.type = type;
    }
}
