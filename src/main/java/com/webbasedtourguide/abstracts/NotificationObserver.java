package com.webbasedtourguide.abstracts;

import com.webbasedtourguide.entities.Notification;
import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.OneToMany;

import java.util.ArrayList;
import java.util.List;

@MappedSuperclass
public abstract class NotificationObserver {

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn
    private List<Notification> notifications = new ArrayList<>();

    public void addNotification(Notification notif) {
        notifications.add(notif);
    }

    public List<Notification> getNotifications() {
        // Reading no longer consumes notifications; they stay until removed explicitly
        return new ArrayList<>(notifications);
    }

    public boolean removeNotification(long id) {
        return notifications.removeIf(notification -> notification.getId() != null && notification.getId() == id);
    }

    public void clearNotifications() {
        notifications.clear();
    }
}
