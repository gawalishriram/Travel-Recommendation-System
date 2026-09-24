package com.example.config;

import java.nio.file.Path;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final FileStorageConfig fileStorageConfig;

    public WebConfig(
            FileStorageConfig fileStorageConfig) {

        this.fileStorageConfig =
                fileStorageConfig;
    }

    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry) {

        Path uploadDirectory =
                fileStorageConfig.getUploadDirectory();

        try {
            java.nio.file.Files.createDirectories(uploadDirectory);
        } catch (Exception ignored) {
        }

        String location =
                uploadDirectory
                        .toUri()
                        .toString();

        if (!location.endsWith("/")) {
            location += "/";
        }

        registry
                .addResourceHandler(
                        "/uploads/destinations/**"
                )
                .addResourceLocations(location);
    }
}