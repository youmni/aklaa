package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.request.LoginDTO;
import com.aklaa.api.dtos.request.PasswordResetRequestDTO;
import com.aklaa.api.dtos.request.RegistrationDTO;
import com.aklaa.api.dtos.response.AuthResponseDTO;
import com.aklaa.api.dtos.response.UserDTO;

public interface AuthService {
    UserDTO register(RegistrationDTO registrationDTO);
    AuthResponseDTO login(LoginDTO loginDTO);
    void processPasswordResetRequest(PasswordResetRequestDTO passwordResetRequestDTO);
}
