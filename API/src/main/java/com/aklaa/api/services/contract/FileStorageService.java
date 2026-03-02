package com.aklaa.api.services.contract;

import org.springframework.web.multipart.MultipartFile;

/**
 * Service interface for file storage operations.
 * <p>
 * This service provides functionality for uploading files to cloud storage
 * (MinIO, Azure Blob Storage, etc.) and retrieving their public URLs.
 * </p>
 */
public interface FileStorageService {
    
    /**
     * Uploads a file to the storage and returns its public URL.
     * <p>
     * This method uploads the file to a storage bucket/container with a unique object name
     * generated using a timestamp and the original filename. The file becomes publicly accessible
     * through the returned URL.
     * </p>
     *
     * @param file the multipart file to upload
     * @return the public URL of the uploaded file
     * @throws Exception if an error occurs during the upload process, such as
     *         I/O errors, connection issues, or storage access problems
     */
    String uploadFile(MultipartFile file) throws Exception;
}
