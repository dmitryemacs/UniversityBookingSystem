package com.univer.booking.service;

import com.univer.booking.dto.EquipmentRequest;
import com.univer.booking.dto.EquipmentResponse;
import com.univer.booking.exception.ResourceNotFoundException;
import com.univer.booking.model.Equipment;
import com.univer.booking.model.EquipmentCategory;
import com.univer.booking.repository.EquipmentCategoryRepository;
import com.univer.booking.repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentCategoryRepository equipmentCategoryRepository;

    @Transactional(readOnly = true)
    public List<EquipmentResponse> getAllEquipment() {
        return equipmentRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EquipmentResponse getEquipmentById(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + id));
        return toResponse(equipment);
    }

    @Transactional(readOnly = true)
    public List<EquipmentResponse> getAvailableEquipment(Instant startTime, Instant endTime) {
        List<Equipment> available;
        if (startTime != null && endTime != null) {
            available = equipmentRepository.findAvailableByDateRange(
                    startTime, endTime, Equipment.Status.AVAILABLE);
        } else {
            available = equipmentRepository.findByStatus(Equipment.Status.AVAILABLE);
        }
        return available.stream().map(this::toResponse).toList();
    }

    public EquipmentResponse createEquipment(EquipmentRequest request) {
        Equipment equipment = Equipment.builder()
                .name(request.getName())
                .description(request.getDescription())
                .serialNumber(request.getSerialNumber())
                .location(request.getLocation())
                .capacity(request.getCapacity() != null ? request.getCapacity() : 1)
                .build();

        if (request.getStatus() != null) {
            equipment.setStatus(Equipment.Status.valueOf(request.getStatus().toUpperCase()));
        }

        if (request.getCategoryId() != null) {
            EquipmentCategory category = equipmentCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            equipment.setCategory(category);
        }

        Equipment saved = equipmentRepository.save(equipment);
        return toResponse(saved);
    }

    public EquipmentResponse updateEquipment(Long id, EquipmentRequest request) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + id));

        equipment.setName(request.getName());
        equipment.setDescription(request.getDescription());
        equipment.setSerialNumber(request.getSerialNumber());
        equipment.setLocation(request.getLocation());
        
        if (request.getCapacity() != null) {
            equipment.setCapacity(request.getCapacity());
        }

        if (request.getStatus() != null) {
            equipment.setStatus(Equipment.Status.valueOf(request.getStatus().toUpperCase()));
        }

        if (request.getCategoryId() != null) {
            EquipmentCategory category = equipmentCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            equipment.setCategory(category);
        }

        Equipment saved = equipmentRepository.save(equipment);
        return toResponse(saved);
    }

    public void deleteEquipment(Long id) {
        equipmentRepository.deleteById(id);
    }

    private EquipmentResponse toResponse(Equipment equipment) {
        return EquipmentResponse.builder()
                .id(equipment.getId())
                .name(equipment.getName())
                .description(equipment.getDescription())
                .categoryName(equipment.getCategory() != null ? equipment.getCategory().getName() : null)
                .serialNumber(equipment.getSerialNumber())
                .status(equipment.getStatus().name())
                .location(equipment.getLocation())
                .capacity(equipment.getCapacity())
                .createdAt(equipment.getCreatedAt())
                .build();
    }
}
