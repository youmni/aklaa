package com.aklaa.api.services.implementation;

import com.aklaa.api.services.contract.MinioService;
import io.minio.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
public class MinioServiceImpl implements MinioService {

    private final MinioClient minioClient;
    private final String bucketName;
    private final String url;

    public MinioServiceImpl(
            @Value("${minio.endpoint}") String endpoint,
            @Value("${minio.access-key}") String accessKey,
            @Value("${minio.secret-key}") String secretKey,
            @Value("${minio.bucket.name}") String bucketName,
            @Value("${minio.endpoint.extern}") String url
    ) throws Exception {
        this.bucketName = bucketName;
        this.url = url;

        this.minioClient = MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();

        boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
        if (!found) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
        }

        String publicPolicy = "{\n" +
                "  \"Version\": \"2012-10-17\",\n" +
                "  \"Statement\": [{\n" +
                "    \"Effect\": \"Allow\",\n" +
                "    \"Principal\": {\"AWS\": [\"*\"]},\n" +
                "    \"Action\": [\"s3:GetObject\"],\n" +
                "    \"Resource\": [\"arn:aws:s3:::" + bucketName + "/*\"]\n" +
                "  }]\n" +
                "}";
        minioClient.setBucketPolicy(SetBucketPolicyArgs.builder()
                .bucket(bucketName)
                .config(publicPolicy)
                .build());
    }

    @Override
    public String uploadFile(MultipartFile file) throws Exception {
        String objectName = "uploads/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

        try (InputStream is = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .stream(is, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );
        }

        return url + "/" + bucketName + "/" + objectName;
    }
}