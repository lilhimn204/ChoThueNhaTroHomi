package com.trotot.backend.controller;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import com.trotot.backend.entity.UserStatus;
import com.trotot.backend.repository.UserRepository;

@SuppressWarnings("null")
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Sql(scripts = "/seed-test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@DisplayName("AuthController — API integration tests")
class AuthControllerIntegrationTest {

    private static final String TEST_EMAIL = "binh.test@example.com";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    @Order(1)
    @DisplayName("POST /api/v1/auth/register — 201 Created and requires OTP")
    void register_validData_returns201AndRequiresOtp() throws Exception {
        String requestBody = """
                {
                    "fullName": "Trần Minh Bình",
                    "email": "binh.test@example.com",
                    "password": "secure123",
                    "phone": "0909123456"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email", is(TEST_EMAIL)))
                .andExpect(jsonPath("$.expiresInMinutes", is(10)))
                .andExpect(jsonPath("$.resendCooldownSeconds", is(60)))
                .andExpect(jsonPath("$.message", containsString("OTP")));

        var user = userRepository.findByEmail(TEST_EMAIL).orElseThrow();
        assertFalse(user.isEmailVerified());
        assertFalse(user.isEnabled());
        assertEquals(UserStatus.INACTIVE, user.getStatus());
        assertNotNull(user.getOtpHash());
        assertNotNull(user.getOtpExpiresAt());
    }

    @Test
    @Order(2)
    @DisplayName("POST /api/v1/auth/register — 400 when email already exists")
    void register_duplicateEmail_returns400() throws Exception {
        String requestBody = """
                {
                    "fullName": "Another User",
                    "email": "binh.test@example.com",
                    "password": "password123",
                    "phone": ""
                }
                """;

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Email")));
    }

    @Test
    @Order(3)
    @DisplayName("POST /api/v1/auth/login — 400 before email verification")
    void login_unverifiedEmail_returns400() throws Exception {
        String requestBody = """
                {
                    "email": "binh.test@example.com",
                    "password": "secure123"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("chưa xác minh")));
    }

    @Test
    @Order(4)
    @DisplayName("POST /api/v1/auth/resend-otp — 200 when resend is allowed")
    void resendOtp_allowed_returns200() throws Exception {
        var user = userRepository.findByEmail(TEST_EMAIL).orElseThrow();
        user.setOtpLastSentAt(Instant.now().minusSeconds(120));
        user.setOtpResendCount(0);
        userRepository.save(user);

        String requestBody = """
                {
                    "email": "binh.test@example.com"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/resend-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is(TEST_EMAIL)))
                .andExpect(jsonPath("$.message", containsString("OTP")));

        var updated = userRepository.findByEmail(TEST_EMAIL).orElseThrow();
        assertEquals(1, updated.getOtpResendCount());
    }

    @Test
    @Order(5)
    @DisplayName("POST /api/v1/auth/verify-otp — 400 with wrong OTP")
    void verifyOtp_wrongCode_returns400AndIncrementsAttempts() throws Exception {
        setKnownOtp("123456", 300);

        String requestBody = """
                {
                    "email": "binh.test@example.com",
                    "otp": "000000"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("OTP")));

        var user = userRepository.findByEmail(TEST_EMAIL).orElseThrow();
        assertEquals(1, user.getOtpAttempts());
        assertFalse(user.isEmailVerified());
    }

    @Test
    @Order(6)
    @DisplayName("POST /api/v1/auth/verify-otp — 400 with expired OTP")
    void verifyOtp_expiredCode_returns400() throws Exception {
        setKnownOtp("123456", -60);

        String requestBody = """
                {
                    "email": "binh.test@example.com",
                    "otp": "123456"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("hết hạn")));
    }

    @Test
    @Order(7)
    @DisplayName("POST /api/v1/auth/verify-otp — 200 with valid OTP and returns token")
    void verifyOtp_validCode_returns200AndActivatesAccount() throws Exception {
        setKnownOtp("123456", 300);

        String requestBody = """
                {
                    "email": "binh.test@example.com",
                    "otp": "123456"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.user.email", is(TEST_EMAIL)));

        var user = userRepository.findByEmail(TEST_EMAIL).orElseThrow();
        assertTrue(user.isEmailVerified());
        assertTrue(user.isEnabled());
        assertEquals(UserStatus.ACTIVE, user.getStatus());
    }

    @Test
    @Order(8)
    @DisplayName("POST /api/v1/auth/login — 200 with valid credentials after verification")
    void login_validCredentials_returns200() throws Exception {
        String requestBody = """
                {
                    "email": "binh.test@example.com",
                    "password": "secure123"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.user.email", is(TEST_EMAIL)));
    }

    @Test
    @Order(9)
    @DisplayName("POST /api/v1/auth/login — 401 with wrong password")
    void login_wrongPassword_returns401() throws Exception {
        String requestBody = """
                {
                    "email": "binh.test@example.com",
                    "password": "wrong-password"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(10)
    @DisplayName("POST /api/v1/auth/register — 400 with empty email (validation)")
    void register_emptyEmail_returns400WithFieldError() throws Exception {
        String requestBody = """
                {
                    "fullName": "Test User",
                    "email": "",
                    "password": "123456",
                    "phone": ""
                }
                """;

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors").isNotEmpty());
    }

    private void setKnownOtp(String otp, long expiresInSeconds) {
        var user = userRepository.findByEmail(TEST_EMAIL).orElseThrow();
        user.setOtpHash(passwordEncoder.encode(otp));
        user.setOtpExpiresAt(Instant.now().plusSeconds(expiresInSeconds));
        user.setOtpAttempts(0);
        userRepository.save(user);
    }
}
