package com.prod.ploy.service;

import com.prod.ploy.dto.AdminProjectResponse;
import com.prod.ploy.dto.AdminProjectResponse.ClientView;
import com.prod.ploy.dto.AdminProjectResponse.DeliverableView;
import com.prod.ploy.dto.DeliverableUploadResponse;
import com.prod.ploy.model.Deliverable;
import com.prod.ploy.model.Project;
import com.prod.ploy.model.Project.ProjectStatus;
import com.prod.ploy.repository.DeliverableRepository;
import com.prod.ploy.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminProjectService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "application/pdf",
            "image/png",
            "image/jpeg",
            "application/zip",
            "application/x-zip-compressed"
    );
    private static final long MAX_FILE_SIZE = 20 * 1024 * 1024L; // 20 MB

    private final ProjectRepository projectRepository;
    private final DeliverableRepository deliverableRepository;
    private final StorageService storageService;

    @Transactional(readOnly = true)
    public List<AdminProjectResponse> listAll() {
        return projectRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toAdminResponse)
                .toList();
    }

    @Transactional
    public AdminProjectResponse updateStatus(Long projectId, ProjectStatus newStatus) {
        Project project = findOrThrow(projectId);
        project.setStatus(newStatus);
        return toAdminResponse(projectRepository.save(project));
    }

    @Transactional
    public DeliverableUploadResponse uploadDeliverable(Long projectId, MultipartFile file, String note) {
        validateFile(file);

        Project project = findOrThrow(projectId);
        int nextVersion = deliverableRepository.findMaxVersionByProjectId(projectId) + 1;

        String fileUrl = storageService.store(file);

        Deliverable deliverable = new Deliverable();
        deliverable.setProject(project);
        deliverable.setFileUrl(fileUrl);
        deliverable.setVersion(nextVersion);
        deliverable.setNote(note);

        Deliverable saved = deliverableRepository.save(deliverable);

        String downloadUrl = "/api/files/" + project.getMagicToken() + "/" + saved.getId();
        return new DeliverableUploadResponse(saved.getId(), saved.getVersion(), saved.getNote(), downloadUrl);
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new FileValidationException("File must not be empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileValidationException("File exceeds the 20 MB limit");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new FileValidationException("Unsupported file type. Allowed: PDF, PNG, JPG, ZIP");
        }
    }

    private Project findOrThrow(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectService.ProjectNotFoundException(
                        "Project not found: " + projectId));
    }

    private AdminProjectResponse toAdminResponse(Project p) {
        var client = p.getClient();
        var clientView = new ClientView(client.getId(), client.getName(), client.getEmail(), client.getPhone());

        var deliverableViews = p.getDeliverables().stream()
                .map(d -> {
                    String downloadUrl = "/api/files/" + p.getMagicToken() + "/" + d.getId();
                    return new DeliverableView(
                            d.getId(), d.getVersion(), d.getNote(),
                            downloadUrl, d.getUploadedAt().toString());
                })
                .toList();

        return new AdminProjectResponse(
                p.getId(), p.getType(), p.getStatus(), p.getMagicToken(),
                p.getCreatedAt(), p.getUpdatedAt(),
                clientView, deliverableViews);
    }

    public static class FileValidationException extends RuntimeException {
        public FileValidationException(String message) {
            super(message);
        }
    }
}
