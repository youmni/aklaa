package com.aklaa.api.exceptions;

public class AccountBlacklistedException extends RuntimeException {
    public AccountBlacklistedException(String message) {
        super(message);
    }
}
