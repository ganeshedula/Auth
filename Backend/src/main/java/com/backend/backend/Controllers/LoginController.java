package com.backend.backend.Controllers;

import com.backend.backend.database.UserRepo;
import com.backend.backend.database.Users;
import com.backend.backend.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class LoginController {

    @Autowired
    private UserRepo userRepo;

    private final BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder(12);

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        Optional<Users> userOpt = userRepo.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("USER_NOT_FOUND");
        }

        Users user = userOpt.get();

        if (!encoder.matches(
                request.getPassword(),
                user.getPassword())) {

            return ResponseEntity
                    .badRequest()
                    .body("INVALID_PASSWORD");
        }

        return ResponseEntity.ok("LOGIN_SUCCESS");
    }
}