package com.univer.booking.repository;

import com.univer.booking.model.Booking;
import com.univer.booking.model.Equipment;
import com.univer.booking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUserId(Long userId);
    
    List<Booking> findByUserIdAndStatus(Long userId, Booking.Status status);
    
    List<Booking> findByEquipmentId(Long equipmentId);
    
    List<Booking> findByEquipmentIdAndStatusIn(Long equipmentId, List<Booking.Status> statuses);
    
    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
           "WHERE b.equipment = :equipment " +
           "AND b.status IN ('PENDING', 'CONFIRMED') " +
           "AND b.startTime < :endTime AND b.endTime > :startTime")
    boolean existsOverlappingBooking(
        @Param("equipment") Equipment equipment,
        @Param("startTime") Instant startTime,
        @Param("endTime") Instant endTime
    );
    
    List<Booking> findByUserAndStatusIn(User user, List<Booking.Status> statuses);
}
