package com.prod.ploy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${ploy.mail.from}")
    private String fromAddress;

    @Value("${ploy.mail.admin-address}")
    private String adminAddress;

    public void sendClientConfirmation(String toEmail, String clientName, String trackingUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(toEmail);
        message.setSubject("Your project is underway — here's your tracking link");
        message.setText("""
                Hi %s,

                Thanks for submitting your brief! We're reviewing it now and will get started shortly.

                Track your project status here:
                %s

                Bookmark this link — it's how you'll download your finished work.

                We'll be in touch soon.
                """.formatted(clientName, trackingUrl));
        mailSender.send(message);
    }

    public void sendAdminNotification(String clientName, String clientEmail,
                                      String projectType, String trackingUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(adminAddress);
        message.setSubject("New brief: " + projectType + " from " + clientName);
        message.setText("""
                New project brief submitted.

                Client: %s <%s>
                Type: %s

                View in admin dashboard or track directly:
                %s
                """.formatted(clientName, clientEmail, projectType, trackingUrl));
        mailSender.send(message);
    }
}
