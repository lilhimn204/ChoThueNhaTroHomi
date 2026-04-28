package com.trotot.backend.controller;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

@SuppressWarnings("null")
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Sql(scripts = "/seed-test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@DisplayName("AuthController — API integration tests")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @Order(1)
    @DisplayName("POST /api/v1/auth/register — 201 Created with valid data")
    void register_validData_returns201() throws Exception {
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
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.user.fullName", is("Trần Minh Bình")))
                .andExpect(jsonPath("$.user.email", is("binh.test@example.com")));
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
    @DisplayName("POST /api/v1/auth/login — 200 with valid credentials")
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
                .andExpect(jsonPath("$.user.email", is("binh.test@example.com")));
    }

    @Test
    @Order(4)
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
    @Order(5)
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
}
