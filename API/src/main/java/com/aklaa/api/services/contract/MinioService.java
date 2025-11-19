package com.aklaa.api.services.contract;

import org.springframework.web.multipart.MultipartFile;

/**
 * Service interface for MinIO object storage operations.
 * <p>
 * This service handles file upload operations to MinIO, a high-performance
 * object storage system. It manages file storage for various types of content
 * such as dish images, user avatars, and other media files.
 * </p>
 *
 * @author Youmni Malha
 */
public interface MinioService {
    
    /**
     * Uploads a file to MinIO object storage.
     * <p>
     * This method uploads the provided file to the configured MinIO bucket,
     * generates a unique filename to prevent collisions, and returns the
     * accessible URL or path to the uploaded file.
     * </p>
     *
     * @param file the multipart file to upload
     * @return the URL or path to the uploaded file in MinIO storage
     * @throws Exception if the file upload fails due to connection issues, invalid file format,
     *                   insufficient storage space, or other MinIO-related errors
     * @throws IllegalArgumentException if the file is null or empty
     */
    String uploadFile(MultipartFile file) throws Exception;
}