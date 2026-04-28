package com.trotot.backend.service;

import java.time.Instant;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.report.CreateRoomReportRequest;
import com.trotot.backend.dto.report.RoomReportResponse;
import com.trotot.backend.dto.report.UpdateRoomReportStatusRequest;
import com.trotot.backend.entity.Room;
import com.trotot.backend.entity.RoomReport;
import com.trotot.backend.entity.RoomReportReason;
import com.trotot.backend.entity.RoomReportStatus;
import com.trotot.backend.entity.RoomStatus;
import com.trotot.backend.entity.User;
import com.trotot.backend.exception.BusinessException;
import com.trotot.backend.exception.ResourceNotFoundException;
import com.trotot.backend.repository.RoomReportRepository;
import com.trotot.backend.repository.RoomRepository;
import com.trotot.backend.repository.specification.RoomReportSpecifications;
import com.trotot.backend.security.UserPrincipal;
import com.trotot.backend.util.InputSanitizer;

@SuppressWarnings("null")
@Service
public class RoomReportService {

    private static final List<RoomReportStatus> ACTIVE_REPORT_STATUSES = List.of(
            RoomReportStatus.NEW,
            RoomReportStatus.REVIEWING);

    private final RoomReportRepository roomReportRepository;
    private final RoomRepository roomRepository;
    private final UserService userService;

    public RoomReportService(
            RoomReportRepository roomReportRepository,
            RoomRepository roomRepository,
            UserService userService) {
        this.roomReportRepository = roomReportRepository;
        this.roomRepository = roomRepository;
        this.userService = userService;
    }

    @Transactional
    public RoomReportResponse createReport(UserPrincipal principal, CreateRoomReportRequest request) {
        User reporter = userService.getRequiredUserEntity(principal.getId());
        Room room = roomRepository.findById(request.roomId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng trọ với id = " + request.roomId()));

        if (room.getStatus() == RoomStatus.HIDDEN) {
            throw new ResourceNotFoundException("Phòng trọ này hiện không còn hiển thị.");
        }

        boolean hasActiveReport = roomReportRepository.existsByRoomIdAndReporterIdAndStatusIn(
                room.getId(),
                reporter.getId(),
                ACTIVE_REPORT_STATUSES);

        if (hasActiveReport) {
            throw new BusinessException("Bạn đã gửi báo cáo cho phòng này. Admin đang xử lý báo cáo hiện tại.");
        }

        RoomReport report = new RoomReport();
        report.setRoom(room);
        report.setReporter(reporter);
        report.setReason(request.reason());
        report.setDetails(InputSanitizer.sanitizeMultiline(request.details()));

        return toResponse(roomReportRepository.save(report));
    }

    @Transactional(readOnly = true)
    public PageResponse<RoomReportResponse> searchAdminReports(
            RoomReportStatus status,
            RoomReportReason reason,
            String keyword,
            int page,
            int size) {
        var pageable = PageRequest.of(Math.max(page, 0), InputSanitizer.normalizePageSize(size, 20), Sort.by(Sort.Direction.DESC, "createdAt"));
        var reports = roomReportRepository.findAll(
                RoomReportSpecifications.adminSearch(status, reason, InputSanitizer.trimToNull(keyword)),
                pageable);
        return PageResponse.from(reports, this::toResponse);
    }

    @Transactional
    public RoomReportResponse updateStatus(
            Long reportId,
            UpdateRoomReportStatusRequest request,
            Long adminUserId) {
        RoomReport report = roomReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy báo cáo với id = " + reportId));
        User admin = userService.getRequiredUserEntity(adminUserId);

        report.setStatus(request.status());
        report.setAdminNote(InputSanitizer.sanitizeMultiline(request.adminNote()));
        report.setHandledBy(admin);
        report.setHandledAt(Instant.now());

        return toResponse(roomReportRepository.save(report));
    }

    private RoomReportResponse toResponse(RoomReport report) {
        return new RoomReportResponse(
                report.getId(),
                report.getRoom().getId(),
                report.getRoom().getTitle(),
                report.getRoom().getSlug(),
                report.getReporter().getId(),
                report.getReporter().getFullName(),
                report.getReporter().getEmail(),
                report.getReason(),
                report.getDetails(),
                report.getStatus(),
                report.getAdminNote(),
                report.getHandledBy() == null ? null : report.getHandledBy().getFullName(),
                report.getHandledAt(),
                report.getCreatedAt());
    }

}
