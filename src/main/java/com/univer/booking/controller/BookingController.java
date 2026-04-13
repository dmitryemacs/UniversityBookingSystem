package com.univer.booking.controller;

import com.univer.booking.dto.ApiResponse;
import com.univer.booking.dto.BookingRequest;
import com.univer.booking.dto.BookingResponse;
import com.univer.booking.dto.BookingStatusRequest;
import com.univer.booking.model.User;
import com.univer.booking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Bookings", description = "Booking management endpoints")
@Slf4j
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    @Operation(summary = "Get current user's bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getUserBookings(
            @AuthenticationPrincipal User user) {
        List<BookingResponse> bookings = bookingService.getUserBookings(user.getId());
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @Parameter(description = "Booking ID") @PathVariable Long id) {
        BookingResponse booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @PostMapping
    @Operation(summary = "Create new booking")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BookingRequest request) {
        log.info("Creating booking for user {} with equipment {}", user.getId(), request.getEquipmentId());
        try {
            BookingResponse booking = bookingService.createBooking(user.getId(), request);
            return ResponseEntity.ok(ApiResponse.success("Booking created successfully", booking));
        } catch (Exception e) {
            log.error("Failed to create booking: {}", e.getMessage(), e);
            throw e;
        }
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel booking")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @AuthenticationPrincipal User user,
            @Parameter(description = "Booking ID") @PathVariable Long id) {
        BookingResponse booking = bookingService.cancelBooking(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", booking));
    }

    @GetMapping("/equipment/{equipmentId}")
    @Operation(summary = "Get all bookings for equipment")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getEquipmentBookings(
            @Parameter(description = "Equipment ID") @PathVariable Long equipmentId) {
        List<BookingResponse> bookings = bookingService.getEquipmentBookings(equipmentId);
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    @Operation(summary = "Update booking status (Admin/Professor only)")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
            @Parameter(description = "Booking ID") @PathVariable Long id,
            @Valid @RequestBody BookingStatusRequest request) {
        BookingResponse booking = bookingService.updateBookingStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Booking status updated successfully", booking));
    }
}
