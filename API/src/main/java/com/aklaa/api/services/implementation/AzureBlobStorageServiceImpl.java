package com.aklaa.api.services.implementation;

import com.aklaa.api.services.contract.FileStorageService;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.models.BlobHttpHeaders;
import com.azure.storage.blob.models.PublicAccessType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
@ConditionalOnProperty(name = "storage.type", havingValue = "azure")
public class AzureBlobStorageServiceImpl implements FileStorageService {

    private final BlobContainerClient containerClient;

    public AzureBlobStorageServiceImpl(
            @Value("${azure.storage.connection-string}") String connectionString,
            @Value("${azure.storage.container-name}") String containerName
    ) {
        BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient();

        this.containerClient = blobServiceClient.getBlobContainerClient(containerName);
        
        if (!containerClient.exists()) {
            containerClient.create();
            containerClient.setAccessPolicy(PublicAccessType.BLOB, null);
        }
    }

    @Override
    public String uploadFile(MultipartFile file) throws Exception {
        String blobName = "uploads/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        
        BlobClient blobClient = containerClient.getBlobClient(blobName);
        
        try (InputStream inputStream = file.getInputStream()) {
            BlobHttpHeaders headers = new BlobHttpHeaders()
                    .setContentType(file.getContentType());
            
            blobClient.upload(inputStream, file.getSize(), true);
            blobClient.setHttpHeaders(headers);
        }
        
        return blobClient.getBlobUrl();
    }
}
