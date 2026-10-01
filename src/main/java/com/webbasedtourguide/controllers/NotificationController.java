package com.webbasedtourguide.controllers;

import com.webbasedtourguide.entities.Notification;
import com.webbasedtourguide.service.NotificationService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/notification")
class NotificationController {

    private final NotificationService notificationService;

    NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<Notification> getPendingNotifications() {
        return notificationService.getNotifications();
    }
}
