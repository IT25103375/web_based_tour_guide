package com.webbasedtourguide.entities;

import com.webbasedtourguide.enums.TicketStatus;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Ticket {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String title;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(nullable = false)
    @OrderBy("id ASC")
    private List<UserMessage> messages = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private TicketStatus status = TicketStatus.AWAITINGRESPONSE;

    // A user can follow many tickets and a ticket can have many followers
    @ManyToMany
    private List<AuthEntity> authEntities = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<UserMessage> getMessages() {
        return messages;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setMessages(List<UserMessage> messages) {
        this.messages = messages;
    }

    public void setObservers(List<AuthEntity> dependents) {
        this.authEntities = dependents;
    }

    public void addMessage(UserMessage userMessage) {
        messages.add(userMessage);
        addObserver(userMessage.getSender());

        if (status == TicketStatus.AWAITINGRESPONSE && messages.size() > 1)
            status = TicketStatus.ONGOING;
    }

    public UserMessage getFirstMessage() {
        return messages.getFirst();
    }

    public void addObserver(AuthEntity dependent) {
        if (!authEntities.contains(dependent))
            authEntities.add(dependent);
    }

    public void removeObserver(int dependentId) {
        authEntities.removeIf(dependent -> dependent.getId() == dependentId);
    }

    public void solveTicket() {
        status = TicketStatus.SOLVED;

        String notifTitle = "Ticket T%s solved".formatted(id);
        String notifMessage = messages.getLast().getContent().substring(0,
                Math.min(messages.getLast().getContent().length(), Notification.MSG_LENGTH));

        // Remove all dependents after sending solved notification
        authEntities.removeIf(authEntity -> {
            authEntity.getDependent().addNotification(new Notification(notifTitle, notifMessage));
            return true;
        });
    }

    public boolean hasObserver(AuthEntity authEntity) {
        return authEntities.contains(authEntity);
    }
}
