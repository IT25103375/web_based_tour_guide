package com.webbasedtourguide.entities;

import com.webbasedtourguide.enums.RatingType;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
public class Rating {

    public final static int RATINGMAX = 5;

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private AuthEntity sender;

    private String content;

    private Instant timestamp = Instant.now();

    private int starRating;

    @Enumerated(EnumType.STRING)
    private RatingType type;

    public Rating() {
        super();
    }

    public Rating(AuthEntity sender, String content, int starRating, RatingType type) {
        this.sender = sender;
        this.content = content;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AuthEntity getSender() {
        return sender;
    }

    public void setSender(AuthEntity sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
