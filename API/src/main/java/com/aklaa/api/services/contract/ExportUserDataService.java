package com.aklaa.api.services.contract;

import com.aklaa.api.model.User;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface ExportUserDataService {
    byte[] getUserData(User user) throws JsonProcessingException;
}
