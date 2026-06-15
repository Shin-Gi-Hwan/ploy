package com.prod.ploy.controller;

import com.prod.ploy.dto.AdminProjectResponse;
import com.prod.ploy.dto.DeliverableUploadResponse;
import com.prod.ploy.dto.StatusUpdateRequest;
import com.prod.ploy.service.AdminProjectService;
import com.prod.ploy.service.AdminProjectService.FileValidationException;
import com.prod.ploy.service.ProjectService.ProjectNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/*
 * All routes under /api/admin/** are protected by HTTP Basic auth (SecurityConfig).
 * The React admin SPA sends Authorization: Basic <base64> on every request.
 */
@RestController
@RequestMapping("/api/admin/projects")
@RequiredArgsConstructor
public class AdminProjectController {

    private final AdminProjectService adminProjectService;

    @GetMapping
    public List<AdminProjectResponse> listProjects() {
        return adminProjectService.listAll();
    }

    @PatchMapping("/{id}/status")
    public AdminProjectResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest req) {
        return adminProjectService.updateStatus(id, req.status());
    }

    @PostMapping("/{id}/deliverables")
    public ResponseEntity<DeliverableUploadResponse> uploadDeliverable(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "note", required = false) String note) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(adminProjectService.uploadDeliverable(id, file, note));
    }

    @ExceptionHandler(FileValidationException.class)
    ResponseEntity<String> handleValidation(FileValidationException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(ProjectNotFoundException.class)
    ResponseEntity<String> handleNotFound(ProjectNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
