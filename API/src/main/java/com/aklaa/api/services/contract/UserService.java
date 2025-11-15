package com.aklaa.api.services.contract;

import com.aklaa.api.dtos.response.UserDTO;
import com.aklaa.api.dtos.response.UserListResponseDTO;
import com.aklaa.api.model.User;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    UserListResponseDTO getUsers(String search, String type, Pageable pageable);
}
