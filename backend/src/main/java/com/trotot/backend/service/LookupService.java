package com.trotot.backend.service;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trotot.backend.dto.lookup.AmenityResponse;
import com.trotot.backend.dto.lookup.DistrictResponse;
import com.trotot.backend.repository.AmenityRepository;
import com.trotot.backend.repository.DistrictRepository;

@Service
public class LookupService {

    private final DistrictRepository districtRepository;
    private final AmenityRepository amenityRepository;

    public LookupService(DistrictRepository districtRepository, AmenityRepository amenityRepository) {
        this.districtRepository = districtRepository;
        this.amenityRepository = amenityRepository;
    }

    @Transactional(readOnly = true)
    @Cacheable("districts")
    public List<DistrictResponse> getDistricts() {
        return districtRepository.findAllByOrderByDisplayOrderAscNameAsc()
                .stream()
                .map(district -> new DistrictResponse(
                        district.getId(),
                        district.getName(),
                        district.getSlug(),
                        district.getCityName()))
                .toList();
    }

    @Transactional(readOnly = true)
    @Cacheable("amenities")
    public List<AmenityResponse> getAmenities() {
        return amenityRepository.findAllByOrderByCategoryAscNameAsc()
                .stream()
                .map(amenity -> new AmenityResponse(
                        amenity.getId(),
                        amenity.getName(),
                        amenity.getSlug(),
                        amenity.getCategory(),
                        amenity.getIconKey()))
                .toList();
    }
}
