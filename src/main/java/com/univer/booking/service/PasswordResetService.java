package com.univer.booking.service;

import com.univer.booking.dto.ForgotPasswordRequest;
import com.univer.booking.dto.PasswordResetTokenResponse;
import com.univer.booking.dto.ResetPasswordRequest;
import com.univer.booking.exception.ResourceNotFoundException;
import com.univer.booking.model.PasswordResetToken;
import com.univer.booking.model.User;
import com.univer.booking.repository.PasswordResetTokenRepository;
import com.univer.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${spring.mail.host:}")
    private String mailHost;

    public PasswordResetTokenResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        // Delete existing token if any
        passwordResetTokenRepository.deleteByUser(user);

        // Create new token
        String token = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plusSeconds(3600); // 1 hour

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(expiryDate)
                .build();

        passwordResetTokenRepository.save(resetToken);

        // Send email if mail is configured
        if (mailHost != null && !mailHost.isEmpty()) {
            sendResetEmail(user, token);
        }

        return PasswordResetTokenResponse.builder()
                .message("Password reset link has been sent to your email")
                .email(user.getEmail())
                .build();
    }

    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid reset token"));

        if (!resetToken.isValid()) {
            throw new IllegalArgumentException("Reset token is expired or already used");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }

    public boolean validateToken(String token) {
        return passwordResetTokenRepository.findByToken(token)
                .map(PasswordResetToken::isValid)
                .orElse(false);
    }

    private void sendResetEmail(User user, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Password Reset Request");
        message.setText("Hello " + user.getUsername() + ",\n\n" +
                "You requested to reset your password. Click the link below to reset it:\n\n" +
                resetLink + "\n\n" +
                "This link will expire in 1 hour.\n\n" +
                "If you didn't request this, please ignore this email.\n\n" +
                "Best regards,\n" +
                "University Equipment Booking Team");

        mailSender.send(message);
    }
}
