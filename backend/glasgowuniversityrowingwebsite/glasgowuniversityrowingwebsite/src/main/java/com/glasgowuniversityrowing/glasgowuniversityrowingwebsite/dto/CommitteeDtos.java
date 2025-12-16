package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto;

import java.util.List;

public class CommitteeDtos {
    public record MemberResponse(Long id, String role, String name, String bio, String photoUrl) {}
    public record UpdateMember(Long id, String name, String bio) {}
    public record UpdateRequest(List<UpdateMember> members) {}
    public record PhotoResponse(Long id, String photoUrl) {}
}