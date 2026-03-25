package com.univer.booking.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class BookingResponse {
    private Long id;
    private Long equipmentId;
    private String equipmentName;
    private Long userId;
    private String username;
    private Instant startTime;
    private Instant endTime;
    private String status;
    private String purpose;
    private String rejectionReason;
    private Instant createdAt;
}
