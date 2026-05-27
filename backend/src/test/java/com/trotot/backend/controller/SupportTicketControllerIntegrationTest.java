package com.trotot.backend.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@SuppressWarnings("null")
@ActiveProfiles("test")
@DisplayName("SupportTicketController - support forms")
class SupportTicketControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("contact ticket can be submitted without authentication")
    void createContactTicket_withoutAuth_returnsCreated() throws Exception {
        mockMvc.perform(post("/api/v1/support-tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "type": "CONTACT",
                          "fullName": "Nguyễn Văn An",
                          "email": "an@example.com",
                          "phone": "0901234567",
                          "subject": "Cần hỗ trợ tài khoản",
                          "message": "Tôi cần Homi hỗ trợ về tài khoản."
                        }
                        """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.type").value("CONTACT"))
                .andExpect(jsonPath("$.status").value("NEW"));
    }

    @Test
    @DisplayName("room report requires listing reference")
    void createRoomReport_missingListingReference_returnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/v1/support-tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "type": "ROOM_REPORT",
                          "reason": "Thông tin sai",
                          "message": "Tin đăng sai địa chỉ."
                        }
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Mã tin hoặc link bài đăng không được để trống."));
    }
}
