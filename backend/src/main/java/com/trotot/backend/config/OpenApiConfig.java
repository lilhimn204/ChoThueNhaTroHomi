package com.trotot.backend.config;

import org.springframework.context.annotation.Configuration;

import com.trotot.backend.util.CookieUtils;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Homi Rental Room API",
                version = "1.0.0",
                description = "REST API cho website cho thuê phòng trọ Homi, bao gồm người thuê, chủ trọ và admin.",
                contact = @Contact(name = "Homi Team"),
                license = @License(name = "Academic project")),
        servers = {
                @Server(url = "http://localhost:8080", description = "Local backend")
        },
        security = @SecurityRequirement(name = "homiCookieAuth"))
@SecurityScheme(
        name = "homiCookieAuth",
        type = SecuritySchemeType.APIKEY,
        in = SecuritySchemeIn.COOKIE,
        paramName = CookieUtils.AUTH_COOKIE_NAME,
        description = "HttpOnly JWT cookie được backend set sau khi gọi /api/v1/auth/login hoặc /api/v1/auth/register.")
public class OpenApiConfig {
}
