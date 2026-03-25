package com.univer.booking.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class EquipmentResponse {
    private Long id;
    private String name;
    private String description;
    private String categoryName;
    private String serialNumber;
    private String status;
    private String location;
    private Integer capacity;
    private Instant createdAt;
}
