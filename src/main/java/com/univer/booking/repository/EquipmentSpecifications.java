package com.univer.booking.repository;

import com.univer.booking.dto.EquipmentSearchRequest;
import com.univer.booking.model.Equipment;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Component
public class EquipmentSpecifications {

    public Specification<Equipment> search(EquipmentSearchRequest request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Text search across name, description, serialNumber
            if (request.getSearch() != null && !request.getSearch().isBlank()) {
                String searchPattern = "%" + request.getSearch().toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("name")), searchPattern),
                    cb.like(cb.lower(root.get("description")), searchPattern),
                    cb.like(cb.lower(root.get("serialNumber")), searchPattern)
                ));
            }

            // Filter by statuses
            if (request.getStatuses() != null && !request.getStatuses().isEmpty()) {
                List<Equipment.Status> statusEnums = request.getStatuses().stream()
                    .map(s -> Equipment.Status.valueOf(s.toUpperCase()))
                    .toList();
                predicates.add(root.get("status").in(statusEnums));
            }

            // Filter by category IDs
            if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
                predicates.add(root.get("category").get("id").in(request.getCategoryIds()));
            }

            // Filter by location
            if (request.getLocation() != null && !request.getLocation().isBlank()) {
                predicates.add(cb.like(
                    cb.lower(root.get("location")), 
                    "%" + request.getLocation().toLowerCase() + "%"
                ));
            }

            // Filter by min capacity
            if (request.getMinCapacity() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("capacity"), request.getMinCapacity()));
            }

            // Filter by max capacity
            if (request.getMaxCapacity() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("capacity"), request.getMaxCapacity()));
            }

            // Filter by date availability (exclude equipment that has bookings in the given time range)
            if (request.getStartTime() != null && request.getEndTime() != null) {
                // Subquery to find booked equipment in the time range
                var subquery = query.subquery(Long.class);
                var bookingRoot = subquery.from(com.univer.booking.model.Booking.class);
                subquery.select(bookingRoot.join("equipment").get("id"))
                    .where(cb.and(
                        bookingRoot.get("status").in("PENDING", "CONFIRMED"),
                        cb.lessThan(bookingRoot.get("startTime"), request.getEndTime()),
                        cb.greaterThan(bookingRoot.get("endTime"), request.getStartTime())
                    ));
                
                predicates.add(cb.not(root.get("id").in(subquery)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
