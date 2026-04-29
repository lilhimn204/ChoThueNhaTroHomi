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
import com.trotot.backend.exception.BusinessException;

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

    public void sendRegistrationOtp(String recipientEmail, String fullName, String otp, long expiresInMinutes) {
        if (!appProperties.getMail().isEnabled()) {
            log.warn("Registration OTP email skipped because app.mail.enabled=false for recipient {}.", recipientEmail);
            return;
        }

        if (!StringUtils.hasText(recipientEmail)) {
            throw new BusinessException("Email nhận OTP không hợp lệ.");
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            log.warn("Registration OTP email skipped because JavaMailSender is not configured.");
            throw new BusinessException("Hệ thống gửi email chưa được cấu hình.");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(appProperties.getMail().getFrom());
        message.setTo(recipientEmail);
        message.setSubject("Homi - Mã xác nhận đăng ký");
        message.setText("""
                Xin chào %s,

                Mã xác nhận đăng ký tài khoản Homi của bạn là: %s

                Mã này có hiệu lực trong %d phút. Không chia sẻ mã này với bất kỳ ai.

                Nếu bạn không đăng ký tài khoản Homi, vui lòng bỏ qua email này.
                """.formatted(
                StringUtils.hasText(fullName) ? fullName : "bạn",
                otp,
                expiresInMinutes));

        try {
            mailSender.send(message);
        } catch (MailException exception) {
            log.warn("Could not send registration OTP email to {}: {}", recipientEmail, exception.getMessage());
            throw new BusinessException("Không thể gửi mã OTP đến email đăng ký. Vui lòng thử lại sau.");
        }
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
