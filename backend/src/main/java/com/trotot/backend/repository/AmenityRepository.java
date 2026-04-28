package com.trotot.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trotot.backend.entity.Amenity;

public interface AmenityRepository extends JpaRepository<Amenity, Long> {

    List<Amenity> findAllByOrderByCategoryAscNameAsc();
}
