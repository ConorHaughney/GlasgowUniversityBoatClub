package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.CommitteeDtos.*;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.CommitteeMember;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository.CommitteeRepository;

@Service
public class CommitteeService {

    private final CommitteeRepository repo;
    private final Path mediaDir;
    private final String mediaBaseUrl;

    public CommitteeService(
        CommitteeRepository repo,
        @Value("${app.media.committee-dir:src/main/resources/static/committee}") String mediaDir,
        @Value("${app.media.base-url:/committee}") String mediaBaseUrl
    ) {
        this.repo = repo;
        this.mediaDir = Path.of(mediaDir);
        this.mediaBaseUrl = mediaBaseUrl;
    }

    public List<MemberResponse> listCommittee() {
        return repo.findAllByOrderByOrderAsc().stream()
                .map(m -> new MemberResponse(m.getId(), m.getRole(), m.getName(), m.getBio(), m.getImageUrl(), m.getEmail()))
                .toList();
    }

    public void updateMembers(UpdateRequest req) {
        for (UpdateMember u : req.members()) {
            repo.findById(u.id()).ifPresent(m -> {
                m.setName(u.name());
                m.setBio(u.bio());
                repo.save(m);
            });
        }
    }

    public PhotoResponse uploadPhoto(Long id, MultipartFile file) throws Exception {
        Files.createDirectories(mediaDir);
        String filename = "%d-%s".formatted(id, file.getOriginalFilename());
        Path target = mediaDir.resolve(filename);
        file.transferTo(target);
        String url = mediaBaseUrl.endsWith("/") ? mediaBaseUrl + filename : mediaBaseUrl + "/" + filename;
        CommitteeMember m = repo.findById(id).orElseThrow();
        m.setImageUrl(url);
        repo.save(m);
        return new PhotoResponse(id, url);
    }
}