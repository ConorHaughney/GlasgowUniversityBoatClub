package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.CommitteeDtos.MemberResponse;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.CommitteeDtos.PhotoResponse;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.CommitteeDtos.UpdateMember;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.CommitteeDtos.UpdateRequest;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.CommitteeMember;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository.CommitteeRepository;

@Service
public class CommitteeService {

    private static final long MAX_PHOTO_BYTES = 5L * 1024 * 1024;
    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private final CommitteeRepository repo;
    private final StorageService storageService;

    public CommitteeService(CommitteeRepository repo, StorageService storageService) {
        this.repo = repo;
        this.storageService = storageService;
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

    public PhotoResponse uploadPhoto(Long id, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Photo file is required");
        }

        if (file.getSize() > MAX_PHOTO_BYTES) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(413), "Photo must be 5 MB or smaller");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only JPEG, PNG, or WebP images are allowed");
        }

        CommitteeMember m = repo.findById(id).orElseThrow();
        String originalName = file.getOriginalFilename() == null ? "committee-photo" : file.getOriginalFilename();
        String key = id + "-" + UUID.randomUUID() + "-" + originalName;
        String publicUrl = storageService.uploadPublic(key, file);
        m.setImageUrl(publicUrl);
        repo.save(m);
        return new PhotoResponse(id, publicUrl);
    }
}