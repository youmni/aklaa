package com.aklaa.api.controller;

import com.aklaa.api.annotations.AllowAuthenticated;
import com.aklaa.api.exceptions.ImageProxyException;
import com.aklaa.api.services.contract.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final FileStorageService fileStorageService;

    @AllowAuthenticated
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) throws Exception {
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || 
            (!contentType.equals("image/png") && 
             !contentType.equals("image/jpeg") && 
             !contentType.equals("image/jpg") && 
             !contentType.equals("image/webp"))) {
            throw new ImageProxyException("Only PNG, JPEG, and WebP images are allowed");
        }
        
        String publicUrl = fileStorageService.uploadFile(file);
        return ResponseEntity.ok(publicUrl);
    }

    @AllowAuthenticated
    @GetMapping("/proxy")
    public ResponseEntity<byte[]> proxyImage(@RequestParam("url") String imageUrl) throws Exception {
        HttpURLConnection connection = (HttpURLConnection) URI.create(imageUrl).toURL().openConnection();
        connection.setRequestMethod("GET");
        connection.setConnectTimeout(5000);
        connection.setReadTimeout(5000);
        
        int responseCode = connection.getResponseCode();
        if (responseCode != HttpURLConnection.HTTP_OK) {
            throw new ImageProxyException("Failed to fetch image: HTTP " + responseCode);
        }
        
        String contentType = connection.getContentType();
        
        try (InputStream inputStream = connection.getInputStream()) {
            byte[] imageBytes = inputStream.readAllBytes();
            
            HttpHeaders headers = new HttpHeaders();
            if (contentType != null) {
                headers.setContentType(MediaType.parseMediaType(contentType));
            } else {
                headers.setContentType(MediaType.IMAGE_JPEG);
            }
            
            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        }
    }
}