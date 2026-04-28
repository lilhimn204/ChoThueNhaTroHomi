package com.trotot.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trotot.backend.dto.lookup.AmenityResponse;
import com.trotot.backend.dto.lookup.DistrictResponse;
import com.trotot.backend.service.LookupService;

@RestController
@RequestMapping("/api/v1")
public class LookupController {

    private final LookupService lookupService;

    public LookupController(LookupService lookupService) {
        this.lookupService = lookupService;
    }

    @GetMapping("/districts")
    public List<DistrictResponse> getDistricts() {
        return lookupService.getDistricts();
    }

    @GetMapping("/amenities")
    public List<AmenityResponse> getAmenities() {
        return lookupService.getAmenities();
    }
}
