package com.subtrack.notification_service.controller;

import com.subtrack.notification_service.dto.UpdateRuleRequest;
import com.subtrack.notification_service.entity.Notification;
import com.subtrack.notification_service.entity.NotificationRule;
import com.subtrack.notification_service.exception.NotificationServiceException;
import com.subtrack.notification_service.repository.NotificationRepository;
import com.subtrack.notification_service.repository.NotificationRuleRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
public class NotificationAdminController {

    private final NotificationRepository notificationRepository;
    private final NotificationRuleRepository ruleRepository;

    public NotificationAdminController(NotificationRepository notificationRepository, NotificationRuleRepository ruleRepository) {
        this.notificationRepository = notificationRepository;
        this.ruleRepository = ruleRepository;
    }

    // Optional/Admin
    @GetMapping("/history")
    public ResponseEntity<Page<Notification>> history(
            @RequestParam UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        PageRequest pr = PageRequest.of(Math.max(0, page), Math.min(100, Math.max(1, size)), Sort.by("createdAt").descending());
        return ResponseEntity.ok(notificationRepository.findByUserId(userId, pr));
    }

    // Optional/Admin
    @GetMapping("/rules")
    public ResponseEntity<List<NotificationRule>> rules() {
        return ResponseEntity.ok(ruleRepository.findAll());
    }

    // Optional/Admin
    @PutMapping("/rules/{id}")
    public ResponseEntity<NotificationRule> updateRule(@PathVariable UUID id, @Valid UpdateRuleRequest req) {
        NotificationRule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new NotificationServiceException(HttpStatus.NOT_FOUND, "Rule not found id=" + id));
        rule.setEnabled(req.enabled());
        return ResponseEntity.ok(ruleRepository.save(rule));
    }
}

