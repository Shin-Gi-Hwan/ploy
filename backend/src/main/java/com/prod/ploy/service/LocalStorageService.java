package com.prod.ploy.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/*
 * v1 StorageService implementation — stores files on the local filesystem.
 *
 * Suitable for:
 *   - Local development
 *   - VPS deployments with a persistent volume mounted at STORAGE_PATH
 *
 * NOT suitable for:
 *   - Railway / Render ephemeral containers without a persistent volume add-on
 *     (files are lost on restart/redeploy)
 *
 * See TODOS.md T-STORAGE to upgrade to S3 or Cloudflare R2.
 * Swap this @Service for an S3/R2 implementation — ProjectController and
 * AdminProjectController need no changes (they depend on StorageService interface).
 */
@Service
public class LocalStorageService implements StorageService {

    private final Path storageRoot;

    public LocalStorageService(@Value("${ploy.storage.path:uploads}") String storagePath) {
        this.storageRoot = Paths.get(storagePath).toAbsolutePath().normalize();
    }

    @PostConstruct
    void init() {
        try {
            Files.createDirectories(storageRoot);
        } catch (IOException e) {
            throw new IllegalStateException("Cannot create storage directory: " + storageRoot, e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        }
        String filename = UUID.randomUUID() + extension;
        Path destination = storageRoot.resolve(filename);
        try {
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
        return filename;  // relative to storageRoot — internal key only
    }

    @Override
    public Resource load(String fileUrl) {
        Path file = storageRoot.resolve(fileUrl).normalize();
        // Prevent path traversal: resolved path must stay inside storageRoot
        if (!file.startsWith(storageRoot)) {
            throw new StorageFileNotFoundException("Access denied: " + fileUrl);
        }
        try {
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            }
            throw new StorageFileNotFoundException("File not found: " + fileUrl);
        } catch (MalformedURLException e) {
            throw new StorageFileNotFoundException("Malformed file path: " + fileUrl, e);
        }
    }

    @Override
    public void delete(String fileUrl) {
        Path file = storageRoot.resolve(fileUrl).normalize();
        if (!file.startsWith(storageRoot)) {
            return;  // silently ignore path traversal attempts
        }
        try {
            Files.deleteIfExists(file);
        } catch (IOException e) {
            // Best-effort: log in production but don't throw
        }
    }
}
