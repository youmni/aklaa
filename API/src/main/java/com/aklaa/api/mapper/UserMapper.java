package com.aklaa.api.mapper;

import com.aklaa.api.dtos.RegistrationDTO;
import com.aklaa.api.dtos.UserDTO;
import com.aklaa.api.model.User;
import com.aklaa.api.model.enums.UserType;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDTO(User user){
        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .build();
    }

    public User toEntity(RegistrationDTO registrationDTO){
        return User.builder()
                .firstName(registrationDTO.getFirstName())
                .lastName(registrationDTO.getLastName())
                .email(registrationDTO.getEmail())
                .password(registrationDTO.getPassword())
                .userType(UserType.USER)
                .build();
    }
}
