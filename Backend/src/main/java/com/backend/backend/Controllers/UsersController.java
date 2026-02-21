package com.backend.backend.Controllers;

import com.backend.backend.database.UserRepo;
import com.backend.backend.database.Users;
import com.backend.backend.dto.UserRegisterDTO;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class UsersController {

    @Autowired
    private UserRepo userRepo;

    private final BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder(12);

    @PostMapping("/new_users")
    @Transactional
    public String registerUser(
            @Valid @RequestBody UserRegisterDTO dto) {

        String email = dto.getEmail().trim().toLowerCase();

        if (userRepo.existsByEmail(email))
            return "USER_EXISTS";

        Users user = new Users();
        user.setUsername(dto.getUsername());
        user.setEmail(email);
        user.setPassword(
                encoder.encode(dto.getPassword())
        );

        userRepo.save(user);

        return "REGISTERED";
    }
}
