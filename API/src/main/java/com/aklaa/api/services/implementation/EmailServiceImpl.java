package com.aklaa.api.services.implementation;

import com.aklaa.api.exceptions.EmailSendingException;
import com.aklaa.api.model.User;
import com.aklaa.api.services.contract.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${frontend.url}")
    private String frontendUrl;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendActivationEmail(User user, String token) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/register.html");

            String html;
            try (InputStream inputStream = resource.getInputStream()) {
                html = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
            }

            String activationLink = frontendUrl + "/auth/activate?token=" + token;
            html = html.replace("{{activationLink}}", activationLink);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(user.getEmail());
            helper.setSubject("Activate your Aklaa account");
            helper.setText(html, true);
            mailSender.send(message);

        } catch (IOException | MessagingException e) {
            throw new EmailSendingException("Failed to send activation email", e);
        }
    }

    @Override
    public void sendPasswordResetEmail(User user, String token) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/password-reset.html");

            String html;
            try (InputStream inputStream = resource.getInputStream()) {
                html = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
            }

            String passwordResetLink = frontendUrl + "/auth/password-reset/confirm?token=" + token;
            html = html.replace("{{passwordResetLink}}", passwordResetLink);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(user.getEmail());
            helper.setSubject("Reset the password of your Aklaa account");
            helper.setText(html, true);
            mailSender.send(message);

        } catch (IOException | MessagingException e) {
            throw new EmailSendingException("Failed to send password reset email", e);
        }
    }

    @Override
    public void sendActivationUpdatedEmail(String email, String token) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/email-activation.html");

            String html;
            try (InputStream inputStream = resource.getInputStream()) {
                html = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
            }

            String emailConfirmLink = frontendUrl + "/auth/email-confirm?token=" + token;
            html = html.replace("{{emailConfirmLink}}", emailConfirmLink);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("Confirm your new email");
            helper.setText(html, true);
            mailSender.send(message);

        } catch (IOException | MessagingException e) {
            throw new EmailSendingException("Failed to send activation email for updated email address", e);
        }
    }
}