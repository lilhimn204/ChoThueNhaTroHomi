package com.trotot.backend.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.trotot.backend.entity.District;
import com.trotot.backend.repository.DistrictRepository;

@Component
public class DistrictDataInitializer implements CommandLineRunner {

    private static final String CITY_NAME = "Hà Nội";

    private final DistrictRepository districtRepository;

    public DistrictDataInitializer(DistrictRepository districtRepository) {
        this.districtRepository = districtRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        for (DistrictSeed districtSeed : districts()) {
            District district = districtRepository.findBySlug(districtSeed.slug())
                    .orElseGet(District::new);

            district.setName(districtSeed.name());
            district.setSlug(districtSeed.slug());
            district.setCityName(CITY_NAME);
            district.setDisplayOrder(districtSeed.displayOrder());
            districtRepository.save(district);
        }
    }

    private static List<DistrictSeed> districts() {
        return List.of(
                new DistrictSeed("Cầu Giấy", "cau-giay", 1),
                new DistrictSeed("Đống Đa", "dong-da", 2),
                new DistrictSeed("Hai Bà Trưng", "hai-ba-trung", 3),
                new DistrictSeed("Thanh Xuân", "thanh-xuan", 4),
                new DistrictSeed("Nam Từ Liêm", "nam-tu-liem", 5),
                new DistrictSeed("Bắc Từ Liêm", "bac-tu-liem", 6),
                new DistrictSeed("Hà Đông", "ha-dong", 7),
                new DistrictSeed("Hoàng Mai", "hoang-mai", 8),
                new DistrictSeed("Long Biên", "long-bien", 9),
                new DistrictSeed("Ba Đình", "ba-dinh", 10),
                new DistrictSeed("Hoàn Kiếm", "hoan-kiem", 11),
                new DistrictSeed("Tây Hồ", "tay-ho", 12),
                new DistrictSeed("Gia Lâm", "gia-lam", 13),
                new DistrictSeed("Thanh Trì", "thanh-tri", 14),
                new DistrictSeed("Đông Anh", "dong-anh", 15),
                new DistrictSeed("Hoài Đức", "hoai-duc", 16),
                new DistrictSeed("Chương Mỹ", "chuong-my", 17),
                new DistrictSeed("Mê Linh", "me-linh", 18));
    }

    private record DistrictSeed(String name, String slug, int displayOrder) {
    }
}
