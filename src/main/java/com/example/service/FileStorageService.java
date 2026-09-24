package com.example.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.config.FileStorageConfig;

@Service
public class FileStorageService {

    private final FileStorageConfig fileStorageConfig;

    public FileStorageService(
            FileStorageConfig fileStorageConfig) {

        this.fileStorageConfig =
                fileStorageConfig;
    }

    public String storeDestinationImage(
            MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {

            throw new IllegalArgumentException(
                    "Image file is required."
            );
        }

        String contentType =
                file.getContentType();

        if (contentType == null ||
                !contentType.startsWith("image/")) {

            throw new IllegalArgumentException(
                    "Only image files are allowed."
            );
        }

        Path uploadDirectory =
                fileStorageConfig
                        .getUploadDirectory();

        Files.createDirectories(
                uploadDirectory
        );

        String originalFilename =
                file.getOriginalFilename();

        String extension = "";

        if (originalFilename != null
                && originalFilename.contains(".")) {

            extension =
                    originalFilename.substring(
                            originalFilename
                                    .lastIndexOf(".")
                    )
                    .toLowerCase();
        }

        String filename =
                UUID.randomUUID()
                        .toString()
                + extension;

        Path targetPath =
                uploadDirectory
                        .resolve(filename)
                        .normalize();

        if (!targetPath.startsWith(
                uploadDirectory)) {

            throw new IOException(
                    "Invalid file path."
            );
        }

        Files.copy(
                file.getInputStream(),
                targetPath,
                StandardCopyOption.REPLACE_EXISTING
        );

        return "/uploads/destinations/"
                + filename;
    }

    public Path getUploadDirectory() {
        return fileStorageConfig.getUploadDirectory();
    }
}