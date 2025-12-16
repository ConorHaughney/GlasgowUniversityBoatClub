package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.CommitteeDtos.*;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service.CommitteeService;

@RestController
@RequestMapping("/api")
public class CommitteeController {

    private final CommitteeService service;
    public CommitteeController(CommitteeService service) { this.service = service; }

    @GetMapping("/committee")
    public ResponseEntity<List<MemberResponse>> list() {
        return ResponseEntity.ok(service.listCommittee());
    }

    @PutMapping("/admin/committee")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> update(@RequestBody UpdateRequest req) {
        service.updateMembers(req);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/admin/committee/photo")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PhotoResponse> upload(
            @RequestParam("id") Long id,
            @RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(service.uploadPhoto(id, file));
    }
}