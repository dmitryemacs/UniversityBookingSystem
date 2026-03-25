package com.univer.booking.controller;

import com.univer.booking.dto.ApiResponse;
import com.univer.booking.dto.BookingResponse;
import com.univer.booking.dto.UserResponse;
import com.univer.booking.model.User;
import com.univer.booking.service.BookingService;
import com.univer.booking.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin-only endpoints")
public class AdminController {

    private final UserService userService;
    private final BookingService bookingService;

    @GetMapping("/users")
    @Operation(summary = "Get all users (Admin only)")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/bookings")
    @Operation(summary = "Get all bookings (Admin only)")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        List<BookingResponse> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @PutMapping("/users/{userId}/role")
    @Operation(summary = "Update user role (Admin only)")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @RequestParam User.Role role) {
        UserResponse user = userService.updateUserRole(userId, role);
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", user));
    }
}
