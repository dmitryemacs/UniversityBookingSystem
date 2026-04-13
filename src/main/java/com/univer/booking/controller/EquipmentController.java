package com.univer.booking.controller;

import com.univer.booking.dto.ApiResponse;
import com.univer.booking.dto.EquipmentRequest;
import com.univer.booking.dto.EquipmentResponse;
import com.univer.booking.dto.EquipmentSearchRequest;
import com.univer.booking.model.User;
import com.univer.booking.service.EquipmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Equipment", description = "Equipment management endpoints")
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping
    @Operation(summary = "Get all equipment")
    public ResponseEntity<ApiResponse<List<EquipmentResponse>>> getAllEquipment() {
        List<EquipmentResponse> equipment = equipmentService.getAllEquipment();
        return ResponseEntity.ok(ApiResponse.success(equipment));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get equipment by ID")
    public ResponseEntity<ApiResponse<EquipmentResponse>> getEquipmentById(
            @Parameter(description = "Equipment ID") @PathVariable Long id) {
        EquipmentResponse equipment = equipmentService.getEquipmentById(id);
        return ResponseEntity.ok(ApiResponse.success(equipment));
    }

    @GetMapping("/available")
    @Operation(summary = "Get available equipment")
    public ResponseEntity<ApiResponse<List<EquipmentResponse>>> getAvailableEquipment(
            @Parameter(description = "Start time") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startTime,
            @Parameter(description = "End time") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endTime) {
        List<EquipmentResponse> equipment = equipmentService.getAvailableEquipment(startTime, endTime);
        return ResponseEntity.ok(ApiResponse.success(equipment));
    }

    @PostMapping("/search")
    @Operation(summary = "Search equipment with advanced filters")
    public ResponseEntity<ApiResponse<Page<EquipmentResponse>>> searchEquipment(
            @RequestBody EquipmentSearchRequest request) {
        Page<EquipmentResponse> results = equipmentService.searchEquipment(request);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new equipment (Admin only)")
    public ResponseEntity<ApiResponse<EquipmentResponse>> createEquipment(
            @Valid @RequestBody EquipmentRequest request) {
        EquipmentResponse equipment = equipmentService.createEquipment(request);
        return ResponseEntity.ok(ApiResponse.success("Equipment created successfully", equipment));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update equipment (Admin only)")
    public ResponseEntity<ApiResponse<EquipmentResponse>> updateEquipment(
            @Parameter(description = "Equipment ID") @PathVariable Long id,
            @Valid @RequestBody EquipmentRequest request) {
        EquipmentResponse equipment = equipmentService.updateEquipment(id, request);
        return ResponseEntity.ok(ApiResponse.success("Equipment updated successfully", equipment));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete equipment (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteEquipment(
            @Parameter(description = "Equipment ID") @PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.ok(ApiResponse.success("Equipment deleted successfully", null));
    }
}
