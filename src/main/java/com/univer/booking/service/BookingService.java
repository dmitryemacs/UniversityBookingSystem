package com.univer.booking.service;

import com.univer.booking.dto.BookingRequest;
import com.univer.booking.dto.BookingResponse;
import com.univer.booking.dto.BookingStatusRequest;
import com.univer.booking.exception.ResourceNotFoundException;
import com.univer.booking.model.Booking;
import com.univer.booking.model.Equipment;
import com.univer.booking.model.User;
import com.univer.booking.repository.BookingRepository;
import com.univer.booking.repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EquipmentRepository equipmentRepository;

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return toResponse(booking);
    }

    public BookingResponse createBooking(Long userId, BookingRequest request) {
        log.info("Creating booking for user {} with equipment {}", userId, request.getEquipmentId());
        
        Equipment equipment = equipmentRepository.findById(request.getEquipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found"));

        if (equipment.getStatus() != Equipment.Status.AVAILABLE) {
            throw new IllegalStateException("Equipment is not available for booking");
        }

        // Check for overlapping bookings
        boolean hasOverlap = bookingRepository.existsOverlappingBooking(
                equipment, request.getStartTime(), request.getEndTime());
        if (hasOverlap) {
            throw new IllegalStateException("Equipment is already booked for the selected time period");
        }

        Booking booking = Booking.builder()
                .user(User.builder().id(userId).build())
                .equipment(equipment)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .status(Booking.Status.PENDING)
                .build();

        Booking saved = bookingRepository.save(booking);
        log.info("Booking created successfully with id {}", saved.getId());
        return toResponse(saved);
    }

    public BookingResponse cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only cancel your own bookings");
        }

        if (booking.getStatus() == Booking.Status.CANCELLED) {
            throw new IllegalStateException("Booking is already cancelled");
        }

        if (booking.getStatus() == Booking.Status.COMPLETED) {
            throw new IllegalStateException("Cannot cancel a completed booking");
        }

        booking.setStatus(Booking.Status.CANCELLED);
        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    public BookingResponse updateBookingStatus(Long bookingId, BookingStatusRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Booking.Status newStatus;
        try {
            newStatus = Booking.Status.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + request.getStatus());
        }

        if (newStatus == Booking.Status.REJECTED && request.getRejectionReason() != null) {
            booking.setRejectionReason(request.getRejectionReason());
        }

        booking.setStatus(newStatus);
        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    public List<BookingResponse> getEquipmentBookings(Long equipmentId) {
        return bookingRepository.findByEquipmentId(equipmentId).stream()
                .map(this::toResponse)
                .toList();
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .equipmentId(booking.getEquipment().getId())
                .equipmentName(booking.getEquipment().getName())
                .userId(booking.getUser().getId())
                .username(booking.getUser().getUsername())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .status(booking.getStatus().name())
                .purpose(booking.getPurpose())
                .rejectionReason(booking.getRejectionReason())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
