package com.aklaa.api.controller;

import com.aklaa.api.annotations.AdminRoute;
import com.aklaa.api.dtos.response.SecurityEventDto;
import com.aklaa.api.services.contract.SecurityEventsService;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/security")
public class SecurityEventController {

    @Resource
    private SecurityEventsService securityEventsService;

    @AdminRoute
    @GetMapping
    public ResponseEntity<List<SecurityEventDto>> getAllEventsSince(LocalDateTime since, Pageable pageable) {
        return ResponseEntity.ok(this.securityEventsService.getEventsSince(since, pageable));
    }

    @GetMapping("verify")
    public ResponseEntity<?> verifyEvent(@RequestParam Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }

        this.securityEventsService.verifyEvent(id);

        return ResponseEntity.ok().build();
    }

}
