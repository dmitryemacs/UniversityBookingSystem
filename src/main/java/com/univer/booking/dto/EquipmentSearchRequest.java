package com.univer.booking.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class EquipmentSearchRequest {
    // Text search
    private String search;

    // Filters
    private List<String> statuses;
    private List<Long> categoryIds;
    private String location;
    private Integer minCapacity;
    private Integer maxCapacity;

    // Date range availability
    private Instant startTime;
    private Instant endTime;

    // Sorting
    private String sortBy;       // name, status, location, capacity, createdAt, categoryName
    private String sortOrder;    // asc, desc

    // Pagination
    @Builder.Default
    private int page = 0;
    @Builder.Default
    private int size = 20;
}
