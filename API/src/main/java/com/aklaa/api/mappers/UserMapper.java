package com.aklaa.api.mappers;

import com.aklaa.api.dtos.RegistratieDTO;
import com.aklaa.api.dtos.UserDTO;
import com.aklaa.api.models.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDTO(User user){
        return UserDTO.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .build();
    }

    public User toEntity(RegistratieDTO registratieDTO){
        return User.builder()
                .firstName(registratieDTO.getFirstName())
                .lastName(registratieDTO.getLastName())
                .email(registratieDTO.getEmail())
                .password(registratieDTO.getPassword())
                .build();
    }
}
