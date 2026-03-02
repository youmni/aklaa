package com.aklaa.api.controller;

import com.aklaa.api.annotations.AllowAuthenticated;
import com.aklaa.api.services.contract.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final FileStorageService fileStorageService;

    @AllowAuthenticated
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) throws Exception {
        String publicUrl = fileStorageService.uploadFile(file);
        return ResponseEntity.ok(publicUrl);
    }
}