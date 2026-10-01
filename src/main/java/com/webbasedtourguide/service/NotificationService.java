package com.webbasedtourguide.service;

import com.webbasedtourguide.entities.AuthEntity;
import com.webbasedtourguide.entities.Notification;
import com.webbasedtourguide.repositories.AuthEntityRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

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
    public void removeNotification(long id) {
        AuthEntity user = userService.getCurrentUser();
        user.getDependent().removeNotification(id);
        authEntityRepository.save(user);
    }

    @Transactional
    public void clearNotifications() {
        AuthEntity user = userService.getCurrentUser();
        user.getDependent().clearNotifications();
        authEntityRepository.save(user);
    }

    @Transactional
    public void addNotification(int authId, Notification notif) {
        AuthEntity authEntity = userService.getUser(authId);
        authEntity.getDependent().addNotification(notif);
        authEntityRepository.save(authEntity);
    }
}
