package com.webbasedtourguide.service;

import com.webbasedtourguide.entities.AuthEntity;
import com.webbasedtourguide.entities.Notification;
import com.webbasedtourguide.repositories.AuthEntityRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
class NotificationService {

    private final AuthEntityRepository authEntityRepository;
    private final UserService userService;

    NotificationService(AuthEntityRepository authEntityRepository, UserService userService) {
        this.authEntityRepository = authEntityRepository;
        this.userService = userService;
    }

    @Transactional
    public List<Notification> getNotifications() {
        return userService.getCurrentUser().getDependent().getNotifications();
    }

    @Transactional
    public void addNotification(int authId, Notification notif) {
        AuthEntity authEntity = userService.getUser(authId);
        authEntity.getDependent().addNotification(notif);
        authEntityRepository.save(authEntity);
    }
}
