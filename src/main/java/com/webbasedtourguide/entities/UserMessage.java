package com.webbasedtourguide.entities;

import com.webbasedtourguide.abstracts.AuthEntityDependent;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class UserMessage {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private AuthEntity sender;

    private String content;

    private Instant timestamp = Instant.now();

    public UserMessage(AuthEntity sender, String content) {
        this.sender = sender;
        this.content = content;
    }

    public UserMessage() {}

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
