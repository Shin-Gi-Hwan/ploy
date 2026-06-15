package com.prod.ploy.service;

import com.prod.ploy.dto.IntakeRequest;
import com.prod.ploy.dto.IntakeResponse;
import com.prod.ploy.dto.TrackingResponse;
import com.prod.ploy.model.Brief;
import com.prod.ploy.model.Client;
import com.prod.ploy.model.Deliverable;
import com.prod.ploy.model.Project;
import com.prod.ploy.repository.ClientRepository;
import com.prod.ploy.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ClientRepository clientRepository;
    private final ProjectRepository projectRepository;
    private final EmailService emailService;

    @Value("${ploy.base-url}")
    private String baseUrl;

    /*
     * Intake flow:
     *   1. Upsert client by email (existing clients can reorder)
     *   2. Create Project + Brief in one transaction
     *   3. Send confirmation email to client + notification to admin
     *      — email failures are caught and logged; the project record is always saved
     *   Returns the magic token regardless of email outcome.
     */
    @Transactional
    public IntakeResponse createProject(IntakeRequest req) {
        Client client = clientRepository.findByEmail(req.email())
                .orElseGet(() -> {
                    Client c = new Client();
                    c.setName(req.name());
                    c.setEmail(req.email());
                    c.setPhone(req.phone());
                    return clientRepository.save(c);
                });

        Project project = new Project();
        project.setClient(client);
        project.setType(req.type());

        Brief brief = new Brief();
        brief.setProject(project);
        brief.setVisionText(req.visionText());
        brief.setColorPreferences(req.colorPreferences());
        brief.setStyleRefs(req.styleRefs());
        brief.setAdditionalNotes(req.additionalNotes());

        project.setBrief(brief);
        Project saved = projectRepository.save(project);

        String trackingUrl = baseUrl + "/track/" + saved.getMagicToken();

        // Email failures must not roll back the transaction.
        // The magic token is displayed on the confirmation screen regardless.
        try {
            emailService.sendClientConfirmation(client.getEmail(), client.getName(), trackingUrl);
            emailService.sendAdminNotification(client.getName(), client.getEmail(), req.type().name(), trackingUrl);
        } catch (Exception e) {
            log.error("Email delivery failed for project {} — magic link still active: {}",
                    saved.getId(), trackingUrl, e);
        }

        return new IntakeResponse(saved.getId(), saved.getMagicToken(), trackingUrl);
    }

    @Transactional(readOnly = true)
    public TrackingResponse getByToken(String token) {
        Project project = projectRepository.findByMagicToken(token)
                .orElseThrow(() -> new ProjectNotFoundException(
                        "We couldn't find this project. Check your email for the correct link, or contact us."));

        Deliverable latest = project.latestDeliverable();
        TrackingResponse.DeliverableView deliverableView = null;

        if (latest != null) {
            String downloadUrl = baseUrl + "/api/files/" + token + "/" + latest.getId();
            deliverableView = new TrackingResponse.DeliverableView(
                    latest.getId(),
                    latest.getVersion(),
                    latest.getNote(),
                    downloadUrl
            );
        }

        return new TrackingResponse(
                project.getId(),
                project.getType(),
                project.getStatus(),
                project.getClient().getName(),
                deliverableView
        );
    }

    public static class ProjectNotFoundException extends RuntimeException {
        public ProjectNotFoundException(String message) {
            super(message);
        }
    }
}
