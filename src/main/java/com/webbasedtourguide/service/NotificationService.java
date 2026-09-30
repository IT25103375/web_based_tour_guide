package com.webbasedtourguide.service;

import com.webbasedtourguide.entities.Notification;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
class NotificationService {

    private final UserService userService;

    NotificationService(UserService userService) {
        this.userService = userService;
    }

    @Transactional
    public List<Notification> getNotifications() {
        return userService.getCurrentUser().getDependent().getNotifications();
    }

    @Transactional
    public void addNotification(int authId, Notification notif) {
        userService.getUser(authId).getDependent().addNotification(notif);
    }
}
