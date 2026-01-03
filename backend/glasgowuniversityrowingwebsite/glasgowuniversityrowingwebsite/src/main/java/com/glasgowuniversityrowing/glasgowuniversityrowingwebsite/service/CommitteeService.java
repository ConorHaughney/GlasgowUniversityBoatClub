package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.CommitteeDtos.MemberResponse;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.CommitteeDtos.PhotoResponse;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.CommitteeDtos.UpdateMember;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.CommitteeDtos.UpdateRequest;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.CommitteeMember;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository.CommitteeRepository;

@Service
public class CommitteeService {

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
        CommitteeMember m = repo.findById(id).orElseThrow();
        String key = id + "-" + file.getOriginalFilename();
        String publicUrl = storageService.uploadPublic(key, file);
        m.setImageUrl(publicUrl);
        repo.save(m);
        return new PhotoResponse(id, publicUrl);
    }
}