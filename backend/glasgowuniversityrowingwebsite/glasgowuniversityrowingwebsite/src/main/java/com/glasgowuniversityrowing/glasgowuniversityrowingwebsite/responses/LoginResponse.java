package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.responses;

import java.util.Set;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String token;
    private long expiresIn;
    private String role;
    private Set<String> permissions;

    public LoginResponse(String token, long expiresIn, String role, Set<String> permissions) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.role = role;
        this.permissions = permissions;
    }
}