package com.trotot.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.trotot.backend.dto.room.RoomDetailResponse;
import com.trotot.backend.dto.room.RoomSummaryResponse;
import com.trotot.backend.entity.Amenity;
import com.trotot.backend.entity.AmenityCategory;
import com.trotot.backend.entity.District;
import com.trotot.backend.entity.Room;
import com.trotot.backend.entity.RoomStatus;
import com.trotot.backend.exception.ResourceNotFoundException;
import com.trotot.backend.repository.AmenityRepository;
import com.trotot.backend.repository.ContactRequestRepository;
import com.trotot.backend.repository.DistrictRepository;
import com.trotot.backend.repository.RoomReportRepository;
import com.trotot.backend.repository.RoomRepository;
import com.trotot.backend.repository.SavedRoomRepository;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
@DisplayName("RoomService — Room business logic")
class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private DistrictRepository districtRepository;

    @Mock
    private AmenityRepository amenityRepository;

    @Mock
    private ContactRequestRepository contactRequestRepository;

    @Mock
    private RoomReportRepository roomReportRepository;

    @Mock
    private SavedRoomRepository savedRoomRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private RoomService roomService;

    private District sampleDistrict;

    @BeforeEach
    void setUp() {
        sampleDistrict = new District();
        sampleDistrict.setId(1L);
        sampleDistrict.setName("Cầu Giấy");
        sampleDistrict.setSlug("cau-giay");
        sampleDistrict.setCityName("Hà Nội");
    }

    private Room createSampleRoom(Long id, String title, String slug) {
        Room room = new Room();
        room.setId(id);
        room.setTitle(title);
        room.setSlug(slug);
        room.setDescription("Phòng trọ đẹp, thoáng mát.");
        room.setAddress("123 Xuân Thủy");
        room.setDistrict(sampleDistrict);
        room.setPrice(new BigDecimal("3500000"));
        room.setArea(new BigDecimal("25.00"));
        room.setContactName("Chủ nhà A");
        room.setContactPhone("0987654321");
        room.setStatus(RoomStatus.AVAILABLE);
        room.setThumbnail("/uploads/room1.jpg");
        room.setFeatured(true);
        room.setImages(new ArrayList<>());

        Amenity wifi = new Amenity();
        wifi.setId(1L);
        wifi.setName("Wi-Fi");
        wifi.setSlug("wi-fi");
        wifi.setCategory(AmenityCategory.ROOM);
        wifi.setIconKey("wifi");

        room.setAmenities(new LinkedHashSet<>(Set.of(wifi)));
        return room;
    }

    @Test
    @DisplayName("getFeaturedRooms returns list of room summaries")
    void getFeaturedRooms_returnsRoomSummaries() {
        Room room1 = createSampleRoom(1L, "Phòng trọ A", "phong-tro-a");
        Room room2 = createSampleRoom(2L, "Phòng trọ B", "phong-tro-b");

        when(roomRepository.findTop6ByFeaturedTrueAndStatusOrderByCreatedAtDesc(RoomStatus.AVAILABLE))
                .thenReturn(List.of(room1, room2));

        List<RoomSummaryResponse> result = roomService.getFeaturedRooms();

        assertEquals(2, result.size());
        assertEquals("Phòng trọ A", result.get(0).title());
        assertEquals("Cầu Giấy", result.get(0).districtName());
        assertTrue(result.get(0).featured());
        assertFalse(result.get(0).highlightAmenities().isEmpty());
    }

    @Test
    @DisplayName("getPublicRoomDetail returns detail for valid slug")
    void getPublicRoomDetail_validSlug_returnsDetail() {
        Room room = createSampleRoom(1L, "Phòng trọ cao cấp", "phong-tro-cao-cap");

        when(roomRepository.findDetailedBySlugAndStatusNot("phong-tro-cao-cap", RoomStatus.HIDDEN))
                .thenReturn(Optional.of(room));

        RoomDetailResponse result = roomService.getPublicRoomDetail("phong-tro-cao-cap");

        assertNotNull(result);
        assertEquals("Phòng trọ cao cấp", result.title());
        assertEquals("Cầu Giấy", result.districtName());
        assertEquals(new BigDecimal("3500000"), result.price());
    }

    @Test
    @DisplayName("getPublicRoomDetail throws ResourceNotFoundException for unknown slug")
    void getPublicRoomDetail_unknownSlug_throwsException() {
        when(roomRepository.findDetailedBySlugAndStatusNot("not-exist", RoomStatus.HIDDEN))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> roomService.getPublicRoomDetail("not-exist"));

        assertTrue(exception.getMessage().contains("not-exist"));
    }

    @Test
    @DisplayName("deleteRoom removes room and dependent records")
    void deleteRoom_withDependentRecords_deletesRoom() {
        Room room = createSampleRoom(1L, "Phòng trọ X", "phong-tro-x");

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));

        roomService.deleteRoom(1L);

        verify(contactRequestRepository).deleteByRoomId(1L);
        verify(roomReportRepository).deleteByRoomId(1L);
        verify(savedRoomRepository).deleteByRoomId(1L);
        verify(roomRepository).delete(room);
    }
}
