package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.AuthResponseDTO;
import com.aklaa.api.dtos.LoginDTO;
import com.aklaa.api.dtos.RegistrationDTO;
import com.aklaa.api.dtos.UserDTO;

public interface AuthService {
    UserDTO register(RegistrationDTO registrationDTO);
    AuthResponseDTO login(LoginDTO loginDTO);
}
