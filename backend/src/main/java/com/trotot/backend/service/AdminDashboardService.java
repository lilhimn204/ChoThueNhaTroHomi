package com.trotot.backend.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trotot.backend.dto.dashboard.ChartItem;
import com.trotot.backend.dto.dashboard.DashboardChartResponse;
import com.trotot.backend.dto.dashboard.DashboardSummaryResponse;
import com.trotot.backend.dto.dashboard.RecentContactRequestResponse;
import com.trotot.backend.dto.dashboard.RecentRoomResponse;
import com.trotot.backend.entity.ContactRequestStatus;
import com.trotot.backend.entity.RoomStatus;
import com.trotot.backend.repository.ContactRequestRepository;
import com.trotot.backend.repository.RoomRepository;
import com.trotot.backend.repository.UserRepository;

@Service
public class AdminDashboardService {

    private static final Map<RoomStatus, String> ROOM_STATUS_LABELS = Map.of(
            RoomStatus.AVAILABLE, "Còn phòng",
            RoomStatus.FULL, "Hết phòng",
            RoomStatus.HIDDEN, "Đã ẩn"
    );

    private static final Map<ContactRequestStatus, String> REQUEST_STATUS_LABELS = Map.of(
            ContactRequestStatus.PENDING, "Đang chờ",
            ContactRequestStatus.IN_PROGRESS, "Đang xử lý",
            ContactRequestStatus.RESOLVED, "Đã xử lý",
            ContactRequestStatus.CANCELLED, "Đã hủy"
    );

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final ContactRequestRepository contactRequestRepository;

    public AdminDashboardService(
            RoomRepository roomRepository,
            UserRepository userRepository,
            ContactRequestRepository contactRequestRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.contactRequestRepository = contactRequestRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary() {
        var recentRooms = roomRepository.findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream()
                .map(room -> new RecentRoomResponse(
                        room.getId(),
                        room.getTitle(),
                        room.getSlug(),
                        room.getDistrict().getName(),
                        room.getPrice(),
                        room.getStatus(),
                        room.getCreatedAt()))
                .toList();

        var recentRequests = contactRequestRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(request -> new RecentContactRequestResponse(
                        request.getId(),
                        request.getFullName(),
                        request.getRoom().getTitle(),
                        request.getStatus(),
                        request.getCreatedAt()))
                .toList();

        return new DashboardSummaryResponse(
                roomRepository.count(),
                roomRepository.countByStatus(RoomStatus.AVAILABLE),
                userRepository.count(),
                contactRequestRepository.countByStatus(ContactRequestStatus.PENDING),
                contactRequestRepository.count(),
                recentRooms,
                recentRequests);
    }

    @Transactional(readOnly = true)
    public DashboardChartResponse getDashboardCharts() {
        // Rooms by district
        List<ChartItem> roomsByDistrict = roomRepository.countRoomsByDistrict()
                .stream()
                .map(row -> new ChartItem((String) row[0], (Long) row[1]))
                .toList();

        // Rooms by status
        List<ChartItem> roomsByStatus = roomRepository.countRoomsByStatus()
                .stream()
                .map(row -> new ChartItem(
                        ROOM_STATUS_LABELS.getOrDefault((RoomStatus) row[0], row[0].toString()),
                        (Long) row[1]))
                .toList();

        // Contact requests by status
        List<ChartItem> requestsByStatus = contactRequestRepository.countRequestsByStatus()
                .stream()
                .map(row -> new ChartItem(
                        REQUEST_STATUS_LABELS.getOrDefault((ContactRequestStatus) row[0], row[0].toString()),
                        (Long) row[1]))
                .toList();

        return new DashboardChartResponse(roomsByDistrict, requestsByStatus, roomsByStatus);
    }
}
