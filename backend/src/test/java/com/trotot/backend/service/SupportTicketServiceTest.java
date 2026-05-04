package com.trotot.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.trotot.backend.dto.support.CreateSupportTicketRequest;
import com.trotot.backend.dto.support.SupportTicketResponse;
import com.trotot.backend.entity.SupportTicket;
import com.trotot.backend.entity.SupportTicketStatus;
import com.trotot.backend.entity.SupportTicketType;
import com.trotot.backend.repository.SupportTicketRepository;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
@DisplayName("SupportTicketService — support ticket creation")
class SupportTicketServiceTest {

    @Mock
    private SupportTicketRepository supportTicketRepository;

    @Mock
    private UserService userService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private SupportTicketService supportTicketService;

    @Test
    @DisplayName("createTicket creates admin notifications for wrong-listing reports")
    void createTicket_roomReport_createsAdminNotifications() {
        CreateSupportTicketRequest request = new CreateSupportTicketRequest(
                SupportTicketType.ROOM_REPORT,
                "57514",
                "Thông tin sai",
                null,
                "user@example.com",
                "0912345678",
                null,
                "Giá thuê trong tin không đúng thực tế.");

        when(supportTicketRepository.save(any(SupportTicket.class))).thenAnswer(invocation -> {
            SupportTicket ticket = invocation.getArgument(0);
            ticket.setId(10L);
            return ticket;
        });

        SupportTicketResponse response = supportTicketService.createTicket(request);

        assertEquals(10L, response.id());
        assertEquals(SupportTicketType.ROOM_REPORT, response.type());
        assertEquals(SupportTicketStatus.NEW, response.status());
        verify(notificationService).createNotificationsForSupportTicket(any(SupportTicket.class));
    }
}
