package com.univer.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Username or email is required")
    @Size(min = 3, max = 100, message = "Invalid username or email")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 1, max = 100, message = "Invalid password")
    private String password;
}
