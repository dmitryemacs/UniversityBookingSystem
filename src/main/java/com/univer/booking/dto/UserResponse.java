package com.univer.booking.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String department;
    private Instant createdAt;
}
