package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.*;

public interface AuthService {
    UserDTO register(RegistrationDTO registrationDTO);
    AuthResponseDTO login(LoginDTO loginDTO);
    void processPasswordResetRequest(PasswordResetRequestDTO passwordResetRequestDTO);
}
