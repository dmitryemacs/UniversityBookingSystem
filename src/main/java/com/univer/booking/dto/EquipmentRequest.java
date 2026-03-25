package com.univer.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EquipmentRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    private Long categoryId;

    private String serialNumber;

    private String status;

    private String location;

    private Integer capacity;
}
