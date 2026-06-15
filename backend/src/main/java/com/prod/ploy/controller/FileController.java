package com.prod.ploy.controller;

import com.prod.ploy.repository.DeliverableRepository;
import com.prod.ploy.service.StorageFileNotFoundException;
import com.prod.ploy.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/*
 * File download flow:
 *
 *   GET /api/files/{token}/{deliverableId}
 *     1. Look up Deliverable by id WHERE project.magicToken = token
 *        → 404 if not found (catches both unknown deliverable AND token/project mismatch)
 *     2. Stream file from StorageService
 *        → 404 if StorageService can't find the file (missing from disk/storage)
 *     3. Return as attachment with Content-Disposition header
 *
 * fileUrl is never returned in any other API response — this endpoint is the
 * only way clients can access stored files.
 */
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final DeliverableRepository deliverableRepository;
    private final StorageService storageService;

    @GetMapping("/{token}/{deliverableId}")
    public ResponseEntity<Resource> download(
            @PathVariable String token,
            @PathVariable Long deliverableId) {

        // Validates both existence and that the deliverable belongs to the token's project.
        var deliverable = deliverableRepository
                .findByIdAndProjectMagicToken(deliverableId, token)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Deliverable not found or token does not match"));

        Resource resource;
        try {
            resource = storageService.load(deliverable.getFileUrl());
        } catch (StorageFileNotFoundException ex) {
            throw new ResourceNotFoundException("File not found in storage");
        }

        String filename = extractFilename(deliverable.getFileUrl());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    private String extractFilename(String fileUrl) {
        int lastSlash = fileUrl.lastIndexOf('/');
        return lastSlash >= 0 ? fileUrl.substring(lastSlash + 1) : fileUrl;
    }

    // Simple local exception — global handler can map to 404 response.
    static class ResourceNotFoundException extends RuntimeException {
        ResourceNotFoundException(String message) {
            super(message);
        }
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<String> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
