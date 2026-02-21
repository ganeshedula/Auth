package com.backend.backend.Controllers;

import com.backend.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/otp")
@CrossOrigin("*")
public class OTPController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public String sendOtp(@RequestParam String email) {
        return emailService.sendOtp(email);
    }

    @PostMapping("/verify")
    public String verifyOtp(
            @RequestParam String email,
            @RequestParam String otp
    ) {
        return emailService.verifyOtp(email, otp);
    }
}
