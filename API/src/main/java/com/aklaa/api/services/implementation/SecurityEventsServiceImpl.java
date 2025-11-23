package com.aklaa.api.services.implementation;

import com.aklaa.api.dao.SecurityEventRepository;
import com.aklaa.api.dtos.response.SecurityEventDto;
import com.aklaa.api.model.SecurityEvent;
import com.aklaa.api.model.User;
import com.aklaa.api.model.enums.SecurityEventType;
import com.aklaa.api.services.contract.SecurityEventsService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class SecurityEventsServiceImpl implements SecurityEventsService {

    @Resource
    private SecurityEventRepository securityEventRepository;

    @Override
    public List<SecurityEventDto> getEventsSince(LocalDateTime since, Pageable pageable) {
        return this.securityEventRepository.getAllByCreatedAtAfterOrderByCreatedAtDesc(since, pageable)
                .stream()
                .map(SecurityEventDto::build)
                .toList();
    }

    @Override
    public SecurityEvent registerEvent(User user, User actingUser, SecurityEventType type, String message) {
        var securityEvent = SecurityEvent.builder()
                .user(user)
                .actingUser(actingUser)
                .type(type)
                .message(message)
                .verified(this.getVerificationStatus(user, type))
                .build();

        this.securityEventRepository.save(securityEvent);

        return securityEvent;
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
        if (!type.isDefaultVerify()) {
            return false;
        }

        if (type.getRequiredVerificationAfter() == null || type.getRequiredVerificationDuration() == null) {
            return true;
        }

        var since = LocalDateTime.now().minusDays(type.getRequiredVerificationDuration().toDays());
        var events = this.securityEventRepository.countByUserAndCreatedAtAfter(user, since);

        return events < type.getRequiredVerificationAfter();
    }
}
