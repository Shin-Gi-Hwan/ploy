package com.prod.ploy.controller;

import com.prod.ploy.dto.ClientProjectResponse;
import com.prod.ploy.dto.ServiceRequestPayload;
import com.prod.ploy.model.Member;
import com.prod.ploy.service.ClientProjectService;
import com.prod.ploy.service.ProjectService.ProjectNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * All routes under /api/client/** require JWT + ROLE_CLIENT (enforced in SecurityConfig).
 * The authenticated Member is injected via @AuthenticationPrincipal.
 */
@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
public class ClientController {

    private final ClientProjectService clientProjectService;

    /** POST /api/client/service-requests — submit a new service request */
    @PostMapping("/service-requests")
    public ResponseEntity<ClientProjectResponse> createRequest(
            @Valid @RequestBody ServiceRequestPayload req,
            @AuthenticationPrincipal Member member) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(clientProjectService.createServiceRequest(req, member));
    }

    /** GET /api/client/projects — list all projects for the authenticated client */
    @GetMapping("/projects")
    public List<ClientProjectResponse> getProjects(@AuthenticationPrincipal Member member) {
        return clientProjectService.getProjectsForMember(member);
    }

    /** GET /api/client/projects/{id} — get a single project */
    @GetMapping("/projects/{id}")
    public ClientProjectResponse getProject(
            @PathVariable Long id,
            @AuthenticationPrincipal Member member) {
        return clientProjectService.getProjectForMember(id, member);
    }

    @ExceptionHandler(ProjectNotFoundException.class)
    ResponseEntity<String> handleNotFound(ProjectNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
