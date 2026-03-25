package com.univer.booking.repository;

import com.univer.booking.model.EquipmentCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentCategoryRepository extends JpaRepository<EquipmentCategory, Long> {
    List<EquipmentCategory> findByParentCategoryIsNull();
}
