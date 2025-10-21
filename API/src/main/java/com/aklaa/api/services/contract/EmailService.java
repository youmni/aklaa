package com.aklaa.api.services.contract;

import com.aklaa.api.model.User;
import jakarta.mail.MessagingException;

import java.io.IOException;

public interface EmailService {
    void sendActivationEmail(User user, String token) throws IOException, MessagingException;
}
