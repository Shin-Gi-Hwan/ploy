package com.prod.ploy.controller;

import com.prod.ploy.dto.IntakeRequest;
import com.prod.ploy.dto.IntakeResponse;
import com.prod.ploy.dto.TrackingResponse;
import com.prod.ploy.service.ProjectService;
import com.prod.ploy.service.ProjectService.ProjectNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // Rate-limited by RateLimitInterceptor (5 req/IP/hour)
    @PostMapping
    public ResponseEntity<IntakeResponse> submitBrief(@Valid @RequestBody IntakeRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(req));
    }

    @GetMapping("/track/{token}")
    public ResponseEntity<TrackingResponse> track(@PathVariable String token) {
        return ResponseEntity.ok(projectService.getByToken(token));
    }

    @ExceptionHandler(ProjectNotFoundException.class)
    ResponseEntity<String> handleNotFound(ProjectNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
