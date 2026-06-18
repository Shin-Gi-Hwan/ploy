package com.prod.ploy.service;

import com.prod.ploy.dto.ClientProjectResponse;
import com.prod.ploy.dto.ServiceRequestPayload;
import com.prod.ploy.model.Brief;
import com.prod.ploy.model.Deliverable;
import com.prod.ploy.model.Member;
import com.prod.ploy.model.Project;
import com.prod.ploy.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientProjectService {

    private final ProjectRepository projectRepository;

    @Transactional
    public ClientProjectResponse createServiceRequest(ServiceRequestPayload req, Member member) {
        Project project = new Project();
        project.setMember(member);
        project.setType(req.serviceType());
        project.setTitle(req.title());
        project.setStatus(Project.ProjectStatus.REQUESTED);

        Brief brief = new Brief();
        brief.setProject(project);
        brief.setVisionText(req.description());
        brief.setColorPreferences(req.colorPreferences());
        brief.setStyleRefs(req.styleRefs());
        brief.setAdditionalNotes(req.additionalNotes() != null
                ? req.additionalNotes() + (req.deadline() != null ? "\n납기: " + req.deadline() : "")
                : req.deadline() != null ? "납기: " + req.deadline() : null);

        project.setBrief(brief);
        Project saved = projectRepository.save(project);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ClientProjectResponse> getProjectsForMember(Member member) {
        return projectRepository.findByMemberOrderByCreatedAtDesc(member)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClientProjectResponse getProjectForMember(Long projectId, Member member) {
        Project project = projectRepository.findByIdAndMember(projectId, member)
                .orElseThrow(() -> new ProjectService.ProjectNotFoundException(
                        "Project not found or access denied."));
        return toResponse(project);
    }

    private ClientProjectResponse toResponse(Project p) {
        ClientProjectResponse.MemberView clientView = null;
        if (p.getMember() != null) {
            clientView = new ClientProjectResponse.MemberView(
                    p.getMember().getId(),
                    p.getMember().getName(),
                    p.getMember().getEmail(),
                    p.getMember().getRole().name()
            );
        }

        ClientProjectResponse.MemberView freelancerView = null;
        if (p.getFreelancer() != null) {
            freelancerView = new ClientProjectResponse.MemberView(
                    p.getFreelancer().getId(),
                    p.getFreelancer().getName(),
                    p.getFreelancer().getEmail(),
                    p.getFreelancer().getRole().name()
            );
        }

        List<ClientProjectResponse.DeliverableView> deliverables = p.getDeliverables().stream()
                .map(d -> new ClientProjectResponse.DeliverableView(
                        d.getId(),
                        d.getVersion(),
                        d.getNote(),
                        "/api/files/" + p.getMagicToken() + "/" + d.getId(),
                        d.getUploadedAt() != null ? d.getUploadedAt().toString() : null
                ))
                .toList();

        return new ClientProjectResponse(
                p.getId(),
                p.getTitle() != null ? p.getTitle() : p.getType().name(),
                p.getType(),
                p.getStatus(),
                p.getCreatedAt(),
                p.getUpdatedAt(),
                clientView,
                freelancerView,
                deliverables
        );
    }
}
