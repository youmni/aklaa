package com.aklaa.api.services.contract;

import org.springframework.web.multipart.MultipartFile;

/**
 * Service interface for MinIO object storage operations.
 * <p>
 * This service provides functionality for uploading files to MinIO object storage
 * and retrieving their public URLs.
 * </p>
 */
public interface MinioService {
    
    /**
     * Uploads a file to the MinIO bucket and returns its public URL.
     * <p>
     * This method uploads the file to a MinIO bucket with a unique object name
     * generated using a timestamp and the original filename. The file is stored
     * in the "uploads/" prefix within the bucket and becomes publicly accessible
     * through the returned URL.
     * </p>
     *
     * @param file the multipart file to upload
     * @return the public URL of the uploaded file in the format: 
     *         {@code {minio.endpoint.extern}/{bucket-name}/uploads/{timestamp}_{filename}}
     * @throws Exception if an error occurs during the upload process, such as
     *         I/O errors, MinIO connection issues, or bucket access problems
     */
    String uploadFile(MultipartFile file) throws Exception;
}