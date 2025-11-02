package com.aklaa.api.services.contract;

import org.springframework.web.multipart.MultipartFile;

public interface MinioService {
    String uploadFile(MultipartFile file) throws Exception;
}
