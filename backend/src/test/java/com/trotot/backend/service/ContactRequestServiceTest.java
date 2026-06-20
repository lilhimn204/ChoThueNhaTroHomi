package com.trotot.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.trotot.backend.dto.contact.ContactRequestResponse;
import com.trotot.backend.dto.contact.CreateContactRequestRequest;
import com.trotot.backend.entity.ContactRequest;
import com.trotot.backend.entity.ContactRequestStatus;
import com.trotot.backend.entity.ContactRequestType;
import com.trotot.backend.entity.District;
import com.trotot.backend.entity.Room;
import com.trotot.backend.entity.RoomStatus;
import com.trotot.backend.entity.User;
import com.trotot.backend.exception.BusinessException;
import com.trotot.backend.exception.ResourceNotFoundException;
import com.trotot.backend.repository.ContactRequestRepository;
import com.trotot.backend.repository.RoomRepository;
import com.trotot.backend.security.UserPrincipal;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
@DisplayName("ContactRequestService — creation, validation and cancellation")
class ContactRequestServiceTest {

    @Mock
    private ContactRequestRepository contactRequestRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private UserService userService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ContactRequestService contactRequestService;

    private User sampleUser;
    private Room sampleRoom;
    private UserPrincipal principal;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setFullName("Nguyen Van An");
        sampleUser.setEmail("an@example.com");
        sampleUser.setPasswordHash("hash");
        sampleUser.setEnabled(true);

        principal = UserPrincipal.fromUser(sampleUser);

        District district = new District();
        district.setId(1L);
        district.setName("Cầu Giấy");

        sampleRoom = new Room();
        sampleRoom.setId(10L);
        sampleRoom.setTitle("Phòng trọ đẹp");
        sampleRoom.setSlug("phong-tro-dep");
        sampleRoom.setStatus(RoomStatus.AVAILABLE);
        sampleRoom.setDistrict(district);
        sampleRoom.setPrice(new BigDecimal("3500000"));
        sampleRoom.setArea(new BigDecimal("25"));

        User roomOwner = new User();
        roomOwner.setId(2L);
        sampleRoom.setCreatedBy(roomOwner);
    }

    @Test
    @DisplayName("createContactRequest succeeds for AVAILABLE room")
    void createContactRequest_availableRoom_succeeds() {
        CreateContactRequestRequest request = new CreateContactRequestRequest(
                10L, ContactRequestType.VIEWING, "Nguyen Van An",
                "an@example.com", "0912345678", "Tôi muốn xem phòng", null);

        when(userService.getRequiredUserEntity(1L)).thenReturn(sampleUser);
        when(roomRepository.findById(10L)).thenReturn(Optional.of(sampleRoom));
        when(contactRequestRepository.save(any(ContactRequest.class))).thenAnswer(invocation -> {
            ContactRequest saved = invocation.getArgument(0);
            saved.setId(100L);
            return saved;
        });

        ContactRequestResponse response = contactRequestService.createContactRequest(principal, request);

        assertNotNull(response);
        assertEquals(100L, response.id());
        assertEquals("Nguyen Van An", response.fullName());
        assertEquals("0912345678", response.phone());

        verify(notificationService).createNotificationsForContactRequest(any(ContactRequest.class), any(Room.class));
    }

    @Test
    @DisplayName("createContactRequest sanitizes HTML in fullName and message")
    void createContactRequest_sanitizesInput() {
        CreateContactRequestRequest request = new CreateContactRequestRequest(
                10L, null, "<b>Hacker</b>",
                "test@test.com", "0912345678", "<script>alert(1)</script>Lời nhắn", null);

        when(userService.getRequiredUserEntity(1L)).thenReturn(sampleUser);
        when(roomRepository.findById(10L)).thenReturn(Optional.of(sampleRoom));
        when(contactRequestRepository.save(any(ContactRequest.class))).thenAnswer(invocation -> {
            ContactRequest saved = invocation.getArgument(0);
            saved.setId(101L);
            return saved;
        });

        contactRequestService.createContactRequest(principal, request);

        ArgumentCaptor<ContactRequest> captor = ArgumentCaptor.forClass(ContactRequest.class);
        verify(contactRequestRepository).save(captor.capture());

        ContactRequest saved = captor.getValue();
        assertEquals("Hacker", saved.getFullName());
        assertEquals("alert(1)Lời nhắn", saved.getMessage());
        assertEquals(ContactRequestType.VIEWING, saved.getRequestType());
    }

    @Test
    @DisplayName("createContactRequest throws ResourceNotFoundException for unknown room")
    void createContactRequest_unknownRoom_throwsException() {
        CreateContactRequestRequest request = new CreateContactRequestRequest(
                999L, null, "An", "an@test.com", "0912345678", null, null);

        when(userService.getRequiredUserEntity(1L)).thenReturn(sampleUser);
        when(roomRepository.findById(999L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> contactRequestService.createContactRequest(principal, request));

        assertEquals("Không tìm thấy phòng trọ với id = 999", exception.getMessage());
    }

    @Test
    @DisplayName("createContactRequest throws ResourceNotFoundException for HIDDEN room")
    void createContactRequest_hiddenRoom_throwsException() {
        sampleRoom.setStatus(RoomStatus.HIDDEN);

        CreateContactRequestRequest request = new CreateContactRequestRequest(
                10L, null, "An", "an@test.com", "0912345678", null, null);

        when(userService.getRequiredUserEntity(1L)).thenReturn(sampleUser);
        when(roomRepository.findById(10L)).thenReturn(Optional.of(sampleRoom));

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> contactRequestService.createContactRequest(principal, request));

        assertEquals("Phòng trọ này hiện không còn hiển thị.", exception.getMessage());
    }

    @Test
    @DisplayName("createContactRequest rejects owner requesting their own room")
    void createContactRequest_ownRoom_throwsBusinessException() {
        sampleRoom.setCreatedBy(sampleUser);

        CreateContactRequestRequest request = new CreateContactRequestRequest(
                10L, ContactRequestType.VIEWING, "Nguyen Van An",
                "an@example.com", "0912345678", "Tôi muốn xem phòng", null);

        when(userService.getRequiredUserEntity(1L)).thenReturn(sampleUser);
        when(roomRepository.findById(10L)).thenReturn(Optional.of(sampleRoom));

        BusinessException exception = assertThrows(BusinessException.class,
                () -> contactRequestService.createContactRequest(principal, request));

        assertEquals("Bạn không thể gửi yêu cầu xem phòng cho bài đăng của chính mình.", exception.getMessage());
    }

    @Test
    @DisplayName("cancelMyRequest cancels a PENDING request owned by the current user")
    void cancelMyRequest_pendingOwnedRequest_succeeds() {
        ContactRequest contactRequest = createExistingContactRequest(ContactRequestStatus.PENDING);

        when(contactRequestRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(contactRequest));
        when(contactRequestRepository.save(contactRequest)).thenReturn(contactRequest);

        ContactRequestResponse response = contactRequestService.cancelMyRequest(principal, 100L);

        assertEquals(ContactRequestStatus.CANCELLED, response.status());
        assertEquals(ContactRequestStatus.CANCELLED, contactRequest.getStatus());
        verify(contactRequestRepository).save(contactRequest);
    }

    @Test
    @DisplayName("cancelMyRequest cancels an IN_PROGRESS request owned by the current user")
    void cancelMyRequest_inProgressOwnedRequest_succeeds() {
        ContactRequest contactRequest = createExistingContactRequest(ContactRequestStatus.IN_PROGRESS);

        when(contactRequestRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(contactRequest));
        when(contactRequestRepository.save(contactRequest)).thenReturn(contactRequest);

        ContactRequestResponse response = contactRequestService.cancelMyRequest(principal, 100L);

        assertEquals(ContactRequestStatus.CANCELLED, response.status());
        verify(contactRequestRepository).save(contactRequest);
    }

    @Test
    @DisplayName("cancelMyRequest is idempotent for an already cancelled request")
    void cancelMyRequest_alreadyCancelled_returnsCurrentRequest() {
        ContactRequest contactRequest = createExistingContactRequest(ContactRequestStatus.CANCELLED);

        when(contactRequestRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(contactRequest));

        ContactRequestResponse response = contactRequestService.cancelMyRequest(principal, 100L);

        assertEquals(ContactRequestStatus.CANCELLED, response.status());
        verify(contactRequestRepository, never()).save(any(ContactRequest.class));
    }

    @Test
    @DisplayName("cancelMyRequest rejects a RESOLVED request")
    void cancelMyRequest_resolvedRequest_throwsBusinessException() {
        ContactRequest contactRequest = createExistingContactRequest(ContactRequestStatus.RESOLVED);

        when(contactRequestRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(contactRequest));

        BusinessException exception = assertThrows(BusinessException.class,
                () -> contactRequestService.cancelMyRequest(principal, 100L));

        assertEquals("Yêu cầu đã được xử lý và không thể hủy.", exception.getMessage());
        verify(contactRequestRepository, never()).save(any(ContactRequest.class));
    }

    @Test
    @DisplayName("cancelMyRequest hides requests not owned by the current user")
    void cancelMyRequest_requestNotOwned_throwsResourceNotFoundException() {
        when(contactRequestRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> contactRequestService.cancelMyRequest(principal, 100L));

        assertEquals("Không tìm thấy yêu cầu liên hệ thuộc tài khoản của bạn với id = 100", exception.getMessage());
        verify(contactRequestRepository, never()).save(any(ContactRequest.class));
    }

    private ContactRequest createExistingContactRequest(ContactRequestStatus status) {
        ContactRequest contactRequest = new ContactRequest();
        contactRequest.setId(100L);
        contactRequest.setRoom(sampleRoom);
        contactRequest.setUser(sampleUser);
        contactRequest.setRequestType(ContactRequestType.VIEWING);
        contactRequest.setFullName(sampleUser.getFullName());
        contactRequest.setEmail(sampleUser.getEmail());
        contactRequest.setPhone("0912345678");
        contactRequest.setStatus(status);
        return contactRequest;
    }
}
