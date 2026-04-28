package com.trotot.backend.service;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.trotot.backend.config.AppProperties;
import com.trotot.backend.entity.ContactRequest;
import com.trotot.backend.entity.Room;
import com.trotot.backend.entity.User;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class EmailNotificationService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final AppProperties appProperties;

    public EmailNotificationService(ObjectProvider<JavaMailSender> mailSenderProvider, AppProperties appProperties) {
        this.mailSenderProvider = mailSenderProvider;
        this.appProperties = appProperties;
    }

    @Async
    public void sendContactRequestNotification(User recipient, ContactRequest contactRequest, Room room) {
        if (!appProperties.getMail().isEnabled()) {
            return;
        }

        if (recipient == null || !StringUtils.hasText(recipient.getEmail())) {
            return;
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            log.warn("Email notification skipped because JavaMailSender is not configured.");
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(appProperties.getMail().getFrom());
        message.setTo(recipient.getEmail());
        message.setSubject("Homi - Yêu cầu liên hệ mới");
        message.setText("""
                Có yêu cầu liên hệ mới cho tin đăng: %s

                Người gửi: %s
                Số điện thoại: %s
                Email: %s
                Nội dung: %s
                """.formatted(
                room.getTitle(),
                contactRequest.getFullName(),
                contactRequest.getPhone(),
                nullToEmpty(contactRequest.getEmail()),
                nullToEmpty(contactRequest.getMessage())));

        try {
            mailSender.send(message);
        } catch (MailException exception) {
            log.warn("Could not send contact request email to {}: {}", recipient.getEmail(), exception.getMessage());
        }
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }
}
