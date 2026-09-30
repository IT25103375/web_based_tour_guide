package com.webbasedtourguide.abstracts;

import com.webbasedtourguide.entities.Notification;
import com.webbasedtourguide.utils.ListUtils;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.OneToMany;

import java.util.List;

@MappedSuperclass
public abstract class NotificationObserver {

    @OneToMany
    @JoinColumn
    private List<Notification> notifications;

    public void addNotification(Notification notif) {
        notifications.add(notif);
    }

    public List<Notification> getNotifications() {
        // TODO: Very rudimentary notif system
        return ListUtils.getAndRemoveAll(notifications, notification -> true);
    }
}
