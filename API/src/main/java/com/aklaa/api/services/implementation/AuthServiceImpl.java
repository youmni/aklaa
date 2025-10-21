package com.aklaa.api.services.implementation;

import com.aklaa.api.dao.UserRepository;
import com.aklaa.api.dtos.RegistrationDTO;
import com.aklaa.api.mapper.UserMapper;
import com.aklaa.api.model.User;
import com.aklaa.api.services.contract.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Autowired
    public AuthServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    @Override
    public User register(RegistrationDTO registrationDTO) {
        User user = userMapper.toEntity(registrationDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return user;
    }
}