package com.trotot.backend.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.lookup.AmenityResponse;
import com.trotot.backend.dto.room.AdminRoomListItemResponse;
import com.trotot.backend.dto.room.AdminRoomResponse;
import com.trotot.backend.dto.room.CreateOrUpdateRoomRequest;
import com.trotot.backend.dto.room.RoomDetailResponse;
import com.trotot.backend.dto.room.RoomImageRequest;
import com.trotot.backend.dto.room.RoomImageResponse;
import com.trotot.backend.dto.room.RoomStatsResponse;
import com.trotot.backend.dto.room.RoomSummaryResponse;
import com.trotot.backend.dto.room.UpdateRoomStatusRequest;
import com.trotot.backend.entity.Amenity;
import com.trotot.backend.entity.District;
import com.trotot.backend.entity.Room;
import com.trotot.backend.entity.RoomImage;
import com.trotot.backend.entity.RoomStatus;
import com.trotot.backend.entity.User;
import com.trotot.backend.exception.BusinessException;
import com.trotot.backend.exception.ResourceNotFoundException;
import com.trotot.backend.repository.AmenityRepository;
import com.trotot.backend.repository.ContactRequestRepository;
import com.trotot.backend.repository.DistrictRepository;
import com.trotot.backend.repository.RoomReportRepository;
import com.trotot.backend.repository.RoomRepository;
import com.trotot.backend.repository.SavedRoomRepository;
import com.trotot.backend.repository.specification.RoomSpecifications;
import com.trotot.backend.util.InputSanitizer;
import com.trotot.backend.util.SlugUtils;

@SuppressWarnings("null")
@Service
public class RoomService {

    private static final int MIN_LISTING_CODE = 10_000;
    private static final int MAX_LISTING_CODE = 99_999;

    private final RoomRepository roomRepository;
    private final DistrictRepository districtRepository;
    private final AmenityRepository amenityRepository;
    private final ContactRequestRepository contactRequestRepository;
    private final RoomReportRepository roomReportRepository;
    private final SavedRoomRepository savedRoomRepository;
    private final UserService userService;

    public RoomService(
            RoomRepository roomRepository,
            DistrictRepository districtRepository,
            AmenityRepository amenityRepository,
            ContactRequestRepository contactRequestRepository,
            RoomReportRepository roomReportRepository,
            SavedRoomRepository savedRoomRepository,
            UserService userService) {
        this.roomRepository = roomRepository;
        this.districtRepository = districtRepository;
        this.amenityRepository = amenityRepository;
        this.contactRequestRepository = contactRequestRepository;
        this.roomReportRepository = roomReportRepository;
        this.savedRoomRepository = savedRoomRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public PageResponse<RoomSummaryResponse> searchPublicRooms(
            String keyword,
            Long districtId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            BigDecimal minArea,
            BigDecimal maxArea,
            RoomStatus status,
            List<Long> amenityIds,
            String sort,
            int page,
            int size) {
        var pageable = PageRequest.of(Math.max(page, 0), InputSanitizer.normalizePageSize(size, 20), buildPublicSort(sort));
        var roomPage = roomRepository.findAll(
                RoomSpecifications.publicSearch(keyword, districtId, minPrice, maxPrice, minArea, maxArea, status, amenityIds),
                pageable);
        return PageResponse.from(roomPage, this::toRoomSummaryResponse);
    }

    @Transactional(readOnly = true)
    public List<RoomSummaryResponse> getFeaturedRooms() {
        return roomRepository.findTop6ByFeaturedTrueAndStatusOrderByCreatedAtDesc(RoomStatus.AVAILABLE)
                .stream()
                .map(this::toRoomSummaryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public RoomDetailResponse getPublicRoomDetail(String slug) {
        Room room = roomRepository.findDetailedBySlugAndStatusNot(slug, RoomStatus.HIDDEN)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng trọ với slug = " + slug));
        return toRoomDetailResponse(room);
    }

    @Transactional(readOnly = true)
    public RoomStatsResponse getPublicRoomStats() {
        long visibleRooms = roomRepository.countByStatusNot(RoomStatus.HIDDEN);
        long availableRooms = roomRepository.countByStatus(RoomStatus.AVAILABLE);
        int availableRate = visibleRooms == 0
                ? 0
                : (int) Math.round((availableRooms * 100.0) / visibleRooms);

        return new RoomStatsResponse(visibleRooms, availableRooms, availableRate);
    }

    @Transactional(readOnly = true)
    public PageResponse<AdminRoomListItemResponse> searchAdminRooms(
            String keyword,
            RoomStatus status,
            Long districtId,
            int page,
            int size) {
        var pageable = PageRequest.of(Math.max(page, 0), InputSanitizer.normalizePageSize(size, 20), Sort.by(Sort.Direction.DESC, "createdAt"));
        var roomPage = roomRepository.findAll(RoomSpecifications.adminSearch(keyword, status, districtId), pageable);
        return PageResponse.from(roomPage, this::toAdminRoomListItemResponse);
    }

    @Transactional(readOnly = true)
    public AdminRoomResponse getAdminRoomDetail(Long roomId) {
        Room room = roomRepository.findDetailedById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng trọ với id = " + roomId));
        return toAdminRoomResponse(room);
    }

    @Transactional
    public AdminRoomResponse createRoom(CreateOrUpdateRoomRequest request, Long adminUserId) {
        User admin = userService.getRequiredUserEntity(adminUserId);
        Room room = new Room();
        room.setCreatedBy(admin);
        room.setListingCode(generateUniqueListingCode());
        applyRoomForm(room, request, null);
        return toAdminRoomResponse(roomRepository.save(room));
    }

    @Transactional
    public AdminRoomResponse updateRoom(Long roomId, CreateOrUpdateRoomRequest request) {
        Room room = roomRepository.findDetailedById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng trọ với id = " + roomId));
        applyRoomForm(room, request, roomId);
        return toAdminRoomResponse(roomRepository.save(room));
    }

    @Transactional
    public AdminRoomResponse updateRoomStatus(Long roomId, UpdateRoomStatusRequest request) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng trọ với id = " + roomId));
        room.setStatus(request.status());
        return toAdminRoomResponse(roomRepository.save(room));
    }

    @Transactional
    public void deleteRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng trọ với id = " + roomId));

        contactRequestRepository.deleteByRoomId(roomId);
        roomReportRepository.deleteByRoomId(roomId);
        savedRoomRepository.deleteByRoomId(roomId);
        roomRepository.delete(room);
    }

    private void applyRoomForm(Room room, CreateOrUpdateRoomRequest request, Long currentRoomId) {
        District district = districtRepository.findById(request.districtId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quận/huyện với id = " + request.districtId()));

        if (room.getListingCode() == null || room.getListingCode().isBlank()) {
            room.setListingCode(generateUniqueListingCode());
        }
        room.setTitle(InputSanitizer.sanitizeRequired(request.title()));
        room.setSlug(generateUniqueSlug(request.title(), currentRoomId));
        room.setDescription(InputSanitizer.sanitizeRequiredMultiline(request.description()));
        room.setAddress(InputSanitizer.sanitizeRequired(request.address()));
        room.setDistrict(district);
        room.setPrice(request.price());
        room.setArea(request.area());
        room.setContactName(InputSanitizer.sanitizeRequired(request.contactName()));
        room.setContactPhone(request.contactPhone().trim());
        room.setStatus(request.status() == null ? RoomStatus.AVAILABLE : request.status());
        room.setFeatured(Boolean.TRUE.equals(request.featured()));
        room.getAmenities().clear();
        room.getAmenities().addAll(resolveAmenities(request.amenityIds()));
        synchronizeImages(room, request.images());
        room.setThumbnail(resolveThumbnail(request.thumbnail(), room.getImages()));
    }

    private Set<Amenity> resolveAmenities(List<Long> amenityIds) {
        if (amenityIds == null || amenityIds.isEmpty()) {
            return new LinkedHashSet<>();
        }

        Set<Long> uniqueIds = new LinkedHashSet<>(amenityIds);
        List<Amenity> amenities = amenityRepository.findAllById(uniqueIds);
        if (amenities.size() != uniqueIds.size()) {
            throw new BusinessException("Danh sách tiện ích không hợp lệ.");
        }

        return new LinkedHashSet<>(amenities);
    }

    private void synchronizeImages(Room room, List<RoomImageRequest> imageRequests) {
        room.getImages().clear();
        if (imageRequests == null || imageRequests.isEmpty()) {
            return;
        }

        List<RoomImage> images = new ArrayList<>();
        for (RoomImageRequest imageRequest : imageRequests) {
            RoomImage image = new RoomImage();
            image.setRoom(room);
            image.setImageUrl(imageRequest.imageUrl().trim());
            image.setAltText(InputSanitizer.sanitize(imageRequest.altText()));
            image.setSortOrder(imageRequest.sortOrder() == null ? 0 : imageRequest.sortOrder());
            image.setThumbnail(Boolean.TRUE.equals(imageRequest.isThumbnail()));
            images.add(image);
        }

        images.sort(Comparator.comparingInt(RoomImage::getSortOrder));
        room.getImages().addAll(images);
    }

    private String resolveThumbnail(String thumbnail, List<RoomImage> images) {
        if (thumbnail != null && !thumbnail.isBlank()) {
            return thumbnail.trim();
        }

        return images.stream()
                .filter(RoomImage::isThumbnail)
                .findFirst()
                .or(() -> images.stream().findFirst())
                .map(RoomImage::getImageUrl)
                .orElse(null);
    }

    private String generateUniqueSlug(String title, Long currentRoomId) {
        String baseSlug = SlugUtils.toSlug(title);
        String candidate = baseSlug;
        int counter = 2;

        while (currentRoomId == null ? roomRepository.existsBySlug(candidate) : roomRepository.existsBySlugAndIdNot(candidate, currentRoomId)) {
            candidate = baseSlug + "-" + counter;
            counter++;
        }

        return candidate;
    }

    private String generateUniqueListingCode() {
        String code;
        int attempts = 0;

        do {
            code = String.valueOf(ThreadLocalRandom.current().nextInt(MIN_LISTING_CODE, MAX_LISTING_CODE + 1));
            attempts++;
        } while (roomRepository.existsByListingCode(code) && attempts < 25);

        if (roomRepository.existsByListingCode(code)) {
            throw new BusinessException("Khong the tao ma tin duy nhat. Vui long thu lai.");
        }

        return code;
    }

    private String resolveListingCode(Room room) {
        if (room.getListingCode() != null && !room.getListingCode().isBlank()) {
            return room.getListingCode();
        }

        long id = room.getId() == null ? 0 : room.getId();
        return String.valueOf(MIN_LISTING_CODE + Math.floorMod(id * 7919, 90_000));
    }

    private RoomSummaryResponse toRoomSummaryResponse(Room room) {
        List<String> amenityNames = room.getAmenities().stream()
                .map(Amenity::getName)
                .sorted()
                .limit(4)
                .toList();

        return new RoomSummaryResponse(
                room.getId(),
                resolveListingCode(room),
                room.getSlug(),
                room.getTitle(),
                room.getDistrict().getName(),
                room.getAddress(),
                room.getPrice(),
                room.getArea(),
                room.getStatus(),
                room.getThumbnail(),
                room.isFeatured(),
                room.getCreatedAt(),
                amenityNames);
    }

    private RoomDetailResponse toRoomDetailResponse(Room room) {
        return new RoomDetailResponse(
                room.getId(),
                resolveListingCode(room),
                room.getSlug(),
                room.getTitle(),
                room.getDescription(),
                room.getAddress(),
                room.getDistrict().getId(),
                room.getDistrict().getName(),
                room.getDistrict().getCityName(),
                room.getPrice(),
                room.getArea(),
                room.getContactName(),
                room.getContactPhone(),
                room.getStatus(),
                room.getThumbnail(),
                room.isFeatured(),
                toAmenityResponses(room),
                toRoomImageResponses(room),
                room.getCreatedAt(),
                room.getCreatedAt(),
                room.getUpdatedAt(),
                room.getCreatedBy() == null ? null : room.getCreatedBy().getId());
    }

    private AdminRoomListItemResponse toAdminRoomListItemResponse(Room room) {
        return new AdminRoomListItemResponse(
                room.getId(),
                resolveListingCode(room),
                room.getTitle(),
                room.getSlug(),
                room.getDistrict().getName(),
                room.getPrice(),
                room.getArea(),
                room.getStatus(),
                room.isFeatured(),
                room.getContactName(),
                room.getCreatedAt(),
                room.getCreatedAt());
    }

    private AdminRoomResponse toAdminRoomResponse(Room room) {
        return new AdminRoomResponse(
                room.getId(),
                resolveListingCode(room),
                room.getTitle(),
                room.getSlug(),
                room.getDescription(),
                room.getAddress(),
                room.getDistrict().getId(),
                room.getDistrict().getName(),
                room.getPrice(),
                room.getArea(),
                room.getContactName(),
                room.getContactPhone(),
                room.getStatus(),
                room.getThumbnail(),
                room.isFeatured(),
                toAmenityResponses(room),
                toRoomImageResponses(room),
                room.getCreatedAt(),
                room.getCreatedAt(),
                room.getUpdatedAt());
    }

    private List<AmenityResponse> toAmenityResponses(Room room) {
        Set<Long> seenIds = new LinkedHashSet<>();

        return room.getAmenities().stream()
                .filter(amenity -> amenity.getId() == null || seenIds.add(amenity.getId()))
                .map(this::toAmenityResponse)
                .sorted(Comparator.comparing(AmenityResponse::name))
                .toList();
    }

    private List<RoomImageResponse> toRoomImageResponses(Room room) {
        Set<Long> seenIds = new LinkedHashSet<>();

        return room.getImages().stream()
                .filter(image -> image.getId() == null || seenIds.add(image.getId()))
                .sorted(Comparator
                        .comparingInt(RoomImage::getSortOrder)
                        .thenComparing(image -> image.getId() == null ? Long.MAX_VALUE : image.getId()))
                .map(this::toRoomImageResponse)
                .toList();
    }

    private AmenityResponse toAmenityResponse(Amenity amenity) {
        return new AmenityResponse(
                amenity.getId(),
                amenity.getName(),
                amenity.getSlug(),
                amenity.getCategory(),
                amenity.getIconKey());
    }

    private RoomImageResponse toRoomImageResponse(RoomImage image) {
        return new RoomImageResponse(
                image.getId(),
                image.getImageUrl(),
                image.getAltText(),
                image.getSortOrder(),
                image.isThumbnail());
    }

    private Sort buildPublicSort(String sort) {
        String normalized = sort == null ? "newest" : sort.trim().toLowerCase();
        return switch (normalized) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "area_asc" -> Sort.by(Sort.Direction.ASC, "area");
            case "area_desc" -> Sort.by(Sort.Direction.DESC, "area");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

}
