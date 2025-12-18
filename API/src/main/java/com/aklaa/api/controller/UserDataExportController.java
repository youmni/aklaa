package com.aklaa.api.controller;

import com.aklaa.api.annotations.AllowAuthenticated;
import com.aklaa.api.model.User;
import com.aklaa.api.services.contract.ExportUserDataService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/data/export")
@RequiredArgsConstructor
public class UserDataExportController {

    private final ExportUserDataService exportUserDataService;

    @AllowAuthenticated
    @GetMapping
    public ResponseEntity<byte[]> exportUserData(@AuthenticationPrincipal User user) throws JsonProcessingException {
        byte[] exportdata = exportUserDataService.getUserData(user);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + user.getUsername() + "\"")
                .contentType(MediaType.APPLICATION_JSON)
                .body(exportdata);
    }
}