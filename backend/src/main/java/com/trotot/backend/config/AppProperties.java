package com.trotot.backend.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private final Jwt jwt = new Jwt();
    private final Cors cors = new Cors();
    private final Upload upload = new Upload();
    private final Cookie cookie = new Cookie();
    private final Mail mail = new Mail();

    @Getter
    @Setter
    public static class Jwt {
        private String secret;
        private long expirationMinutes = 1440;
        private long refreshExpirationMinutes = 10080;
    }

    @Getter
    @Setter
    public static class Cors {
        private List<String> allowedOrigins = new ArrayList<>();
    }

    @Getter
    @Setter
    public static class Cookie {
        private boolean secure = false;
    }

    @Getter
    @Setter
    public static class Mail {
        private boolean enabled = false;
        private String from = "no-reply@homi.local";
    }

    @Getter
    @Setter
    public static class Upload {
        private String directory = "uploads";
        private String publicBaseUrl = "";
        private long maxFileSizeMb = 5;
        private List<String> allowedContentTypes = new ArrayList<>(List.of(
                "image/jpeg",
                "image/png",
                "image/webp"));
    }
}
