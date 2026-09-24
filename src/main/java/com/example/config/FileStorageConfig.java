package com.example.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FileStorageConfig {

    private final Path uploadDirectory;

    public FileStorageConfig(
            @Value("${app.upload.dir}") String uploadDir) {

        this.uploadDirectory =
                Paths.get(uploadDir)
                     .toAbsolutePath()
                     .normalize();
    }

    public Path getUploadDirectory() {

        return uploadDirectory;
    }
}