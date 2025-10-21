package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.RegistrationDTO;
import com.aklaa.api.model.User;

public interface UserService {
    User register(RegistrationDTO registrationDTO);
}
