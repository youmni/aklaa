package com.aklaa.api.exceptions;

public class ImageProxyException extends RuntimeException {
    public ImageProxyException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public ImageProxyException(String message) {
        super(message);
    }
}
