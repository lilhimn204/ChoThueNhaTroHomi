package com.trotot.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trotot.backend.entity.District;

public interface DistrictRepository extends JpaRepository<District, Long> {

    List<District> findAllByOrderByDisplayOrderAscNameAsc();

    Optional<District> findBySlug(String slug);
}
