package com.univer.booking.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BookingStatusRequest {

    @NotBlank(message = "Status is required")
    private String status;

    private String rejectionReason;
}
