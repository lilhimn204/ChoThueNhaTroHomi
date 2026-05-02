package com.trotot.backend.service;

import java.time.Instant;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trotot.backend.dto.common.PageResponse;
import com.trotot.backend.dto.support.CreateSupportTicketRequest;
import com.trotot.backend.dto.support.SupportTicketResponse;
import com.trotot.backend.dto.support.UpdateSupportTicketStatusRequest;
import com.trotot.backend.entity.SupportTicket;
import com.trotot.backend.entity.SupportTicketStatus;
import com.trotot.backend.entity.SupportTicketType;
import com.trotot.backend.entity.User;
import com.trotot.backend.exception.BusinessException;
import com.trotot.backend.exception.ResourceNotFoundException;
import com.trotot.backend.repository.SupportTicketRepository;
import com.trotot.backend.repository.specification.SupportTicketSpecifications;
import com.trotot.backend.util.InputSanitizer;

@SuppressWarnings("null")
@Service
public class SupportTicketService {

    private final SupportTicketRepository supportTicketRepository;
    private final UserService userService;

    public SupportTicketService(
            SupportTicketRepository supportTicketRepository,
            UserService userService) {
        this.supportTicketRepository = supportTicketRepository;
        this.userService = userService;
    }

    @Transactional
    public SupportTicketResponse createTicket(CreateSupportTicketRequest request) {
        SupportTicket ticket = new SupportTicket();
        ticket.setType(request.type());
        ticket.setListingReference(InputSanitizer.sanitize(request.listingReference()));
        ticket.setReason(InputSanitizer.sanitize(request.reason()));
        ticket.setFullName(InputSanitizer.sanitize(request.fullName()));
        ticket.setEmail(InputSanitizer.sanitize(request.email()));
        ticket.setPhone(InputSanitizer.sanitize(request.phone()));
        ticket.setSubject(resolveSubject(request));
        ticket.setMessage(resolveMessage(request));

        return toResponse(supportTicketRepository.save(ticket));
    }

    @Transactional(readOnly = true)
    public PageResponse<SupportTicketResponse> searchAdminTickets(
            SupportTicketType type,
            SupportTicketStatus status,
            String keyword,
            int page,
            int size) {
        var pageable = PageRequest.of(Math.max(page, 0), InputSanitizer.normalizePageSize(size, 20), Sort.by(Sort.Direction.DESC, "createdAt"));
        var tickets = supportTicketRepository.findAll(
                SupportTicketSpecifications.adminSearch(type, status, InputSanitizer.trimToNull(keyword)),
                pageable);
        return PageResponse.from(tickets, this::toResponse);
    }

    @Transactional
    public SupportTicketResponse updateStatus(
            Long ticketId,
            UpdateSupportTicketStatusRequest request,
            Long adminUserId) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy yêu cầu hỗ trợ với id = " + ticketId));
        User admin = userService.getRequiredUserEntity(adminUserId);

        ticket.setStatus(request.status());
        ticket.setAdminNote(InputSanitizer.sanitizeMultiline(request.adminNote()));
        ticket.setHandledBy(admin);
        ticket.setHandledAt(Instant.now());

        return toResponse(supportTicketRepository.save(ticket));
    }

    private String resolveSubject(CreateSupportTicketRequest request) {
        String subject = InputSanitizer.sanitize(request.subject());

        if (request.type() == SupportTicketType.CONTACT) {
            if (subject == null) {
                throw new BusinessException("Tiêu đề liên hệ không được để trống.");
            }
            if (InputSanitizer.sanitize(request.fullName()) == null) {
                throw new BusinessException("Họ tên không được để trống.");
            }
            if (InputSanitizer.sanitize(request.email()) == null) {
                throw new BusinessException("Email không được để trống.");
            }
            if (InputSanitizer.sanitize(request.phone()) == null) {
                throw new BusinessException("Số điện thoại không được để trống.");
            }
            return subject;
        }

        return subject == null ? "Báo cáo tin sai" : subject;
    }

    private String resolveMessage(CreateSupportTicketRequest request) {
        String message = InputSanitizer.sanitizeMultiline(request.message());

        if (request.type() == SupportTicketType.ROOM_REPORT) {
            if (InputSanitizer.sanitize(request.listingReference()) == null) {
                throw new BusinessException("Mã tin hoặc link bài đăng không được để trống.");
            }
            if (InputSanitizer.sanitize(request.reason()) == null) {
                throw new BusinessException("Lý do báo cáo không được để trống.");
            }
        }

        if (message == null) {
            throw new BusinessException("Nội dung yêu cầu không được để trống.");
        }

        return message;
    }

    private SupportTicketResponse toResponse(SupportTicket ticket) {
        return new SupportTicketResponse(
                ticket.getId(),
                ticket.getType(),
                ticket.getListingReference(),
                ticket.getReason(),
                ticket.getFullName(),
                ticket.getEmail(),
                ticket.getPhone(),
                ticket.getSubject(),
                ticket.getMessage(),
                ticket.getStatus(),
                ticket.getAdminNote(),
                ticket.getHandledBy() == null ? null : ticket.getHandledBy().getFullName(),
                ticket.getHandledAt(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt());
    }
}
