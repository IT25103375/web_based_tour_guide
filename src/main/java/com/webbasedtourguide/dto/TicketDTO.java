package com.webbasedtourguide.dto;

import com.webbasedtourguide.entities.UserMessage;
import com.webbasedtourguide.enums.TicketStatus;

import java.util.List;

public class TicketDTO {

    private int id;
    private String title;
    private TicketStatus status;
    private List<UserMessageDTO> messages;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        id = id;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public List<UserMessageDTO> getMessages() {
        return messages;
    }

    public UserMessageDTO getFirstMessage() {
        return messages.getFirst();
    }

    public void setMessages(List<UserMessageDTO> messages) {
        this.messages = messages;
    }

    public void addMessage(UserMessageDTO dto) {
        messages.add(dto);
    }
}
