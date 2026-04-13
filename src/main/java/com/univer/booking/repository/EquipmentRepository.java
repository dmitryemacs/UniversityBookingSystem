package com.univer.booking.repository;

import com.univer.booking.model.Equipment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long>, JpaSpecificationExecutor<Equipment> {

    List<Equipment> findByStatus(Equipment.Status status);

    List<Equipment> findByLocationContainingIgnoreCase(String location);

    @Query("SELECT e FROM Equipment e WHERE e.status = :status " +
           "AND e.id NOT IN (" +
           "  SELECT b.equipment.id FROM Booking b " +
           "  WHERE b.status IN ('PENDING', 'CONFIRMED') " +
           "  AND b.startTime < :endTime AND b.endTime > :startTime" +
           ")")
    List<Equipment> findAvailableByDateRange(
        @Param("startTime") Instant startTime,
        @Param("endTime") Instant endTime,
        @Param("status") Equipment.Status status
    );

    // Specification-based search with pagination
    Page<Equipment> findAll(Specification<Equipment> spec, Pageable pageable);
}
