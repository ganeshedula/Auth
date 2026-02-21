package com.backend.backend.service;

import com.backend.backend.database.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private UserRepo userRepo;

    private static final String OTP_PREFIX = "OTP:";

    public String sendOtp(String email) {

        email = email.trim().toLowerCase();

        if (userRepo.existsByEmail(email))
            return "USER_EXISTS";

        String otp = String.valueOf(
                (int) (Math.random() * 900000) + 100000
        );

        redisTemplate.opsForValue().set(
                OTP_PREFIX + email,
                otp,
                Duration.ofMinutes(1)
        );

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("OTP Verification");
        message.setText("Your OTP: " + otp + "\nValid for 1 minute.");

        mailSender.send(message);

        return "OTP_SENT";
    }

    public String verifyOtp(String email, String otp) {

        email = email.trim().toLowerCase();

        if (userRepo.existsByEmail(email))
            return "USER_EXISTS";

        String storedOtp =
                redisTemplate.opsForValue().get(OTP_PREFIX + email);

        if (storedOtp == null)
            return "OTP_EXPIRED";

        if (!storedOtp.equals(otp))
            return "INVALID_OTP";

        redisTemplate.delete(OTP_PREFIX + email);

        return "OTP_VERIFIED";
    }
}
