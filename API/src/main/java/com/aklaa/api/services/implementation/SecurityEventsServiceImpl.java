package com.aklaa.api.services.implementation;

import com.aklaa.api.dao.SecurityEventRepository;
import com.aklaa.api.dao.UserRepository;
import com.aklaa.api.dtos.response.SecurityEventDto;
import com.aklaa.api.model.SecurityEvent;
import com.aklaa.api.model.User;
import com.aklaa.api.model.enums.SecurityEventType;
import com.aklaa.api.model.enums.UserType;
import com.aklaa.api.services.contract.EmailService;
import com.aklaa.api.services.contract.SecurityEventsService;
import jakarta.annotation.Resource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.CompletableFuture;

@Service
public class SecurityEventsServiceImpl implements SecurityEventsService {

    @Resource
    private SecurityEventRepository securityEventRepository;
    @Resource
    private EmailService emailService;
    @Resource
    private UserRepository userRepository;

    @Override
    public List<SecurityEventDto> getEventsSince(LocalDateTime since, Pageable pageable) {
        return this.securityEventRepository.getAllByCreatedAtAfterOrderByCreatedAtDesc(since, pageable)
                .stream()
                .map(SecurityEventDto::build)
                .toList();
    }

    @Async
    @Override
    public void registerEvent(User user, User actingUser, SecurityEventType type, String message) {
        var verify = this.getVerificationStatus(user, type);

        var securityEvent = SecurityEvent.builder()
                .user(user)
                .actingUser(actingUser)
                .type(type)
                .message(message)
                .verified(verify)
                .build();

        this.securityEventRepository.save(securityEvent);

        // TODO: Disable with server config?
        if (!verify) {
            System.out.println("Running in: " + Thread.currentThread().getName());
            var admins = userRepository.findUsersByUserTypeIs(UserType.ADMIN);
            admins.forEach(admin -> emailService.sendSecurityWarning(admin, user, securityEvent));
        }
    }

    @Override
    public void verifyEvent(long id) {
        var event = this.securityEventRepository.getReferenceById(id);
        if (event == null) {
            throw new NoSuchElementException();
        }

        event.setVerified(true);

        this.securityEventRepository.save(event);
    }

    private boolean getVerificationStatus(User user, SecurityEventType type) {
        if (type.getRequiredVerificationAfter() == null || type.getRequiredVerificationDuration() == null) {
            return true;
        }

        var since = LocalDateTime.now().minusHours(type.getRequiredVerificationDuration().toHours());
        var events = this.securityEventRepository.countByUserAndCreatedAtAfterAndVerifiedIs(user, since, false);

        return events < type.getRequiredVerificationAfter();
    }
}
