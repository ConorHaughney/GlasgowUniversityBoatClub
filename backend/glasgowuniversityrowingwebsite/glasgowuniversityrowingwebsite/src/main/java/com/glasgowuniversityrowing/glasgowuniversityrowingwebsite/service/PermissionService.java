package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service;

import java.util.HashSet;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.CommitteeMember;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.User;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository.CommitteeRepository;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository.UserRepository;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.security.PermissionConstants;

@Service
public class PermissionService {

    private final CommitteeRepository committeeRepository;
    private final UserRepository userRepository;

    public PermissionService(CommitteeRepository committeeRepository, UserRepository userRepository) {
        this.committeeRepository = committeeRepository;
        this.userRepository = userRepository;
    }

    public User syncDefaultPermissions(User user) {
        if (user.isPermissionsOverrideEnabled()) {
            return user;
        }

        Set<String> defaults = resolveDefaultPermissionsForEmail(user.getEmail());
        if (defaults.isEmpty() && "ADMIN".equalsIgnoreCase(user.getRole())) {
            defaults = PermissionConstants.ALL;
        }
        Set<String> existing = user.getPermissionSet();

        if (!existing.equals(defaults)) {
            user.setPermissionSet(defaults);
            return userRepository.save(user);
        }

        return user;
    }

    public Set<String> resolveDefaultPermissionsForEmail(String email) {
        Optional<CommitteeMember> committeeMember = committeeRepository.findByEmailIgnoreCase(email);

        if (committeeMember.isEmpty()) {
            return Set.of();
        }

        return mapRoleToPermissions(committeeMember.get().getRole());
    }

    private Set<String> mapRoleToPermissions(String committeeRole) {
        if (committeeRole == null) {
            return Set.of();
        }

        String role = committeeRole.toLowerCase(Locale.ROOT).trim();
        Set<String> permissions = new HashSet<>();

        if (role.equals("captain") || role.equals("secretary") || role.equals("treasurer")) {
            permissions.addAll(PermissionConstants.ALL);
            return permissions;
        }

        if (role.equals("fundraising & sponsorship") || role.equals("social secretary")) {
            permissions.add(PermissionConstants.NEWS_MANAGE);
            permissions.add(PermissionConstants.EVENTS_MANAGE);
            return permissions;
        }

        if (role.equals("kit officer")) {
            permissions.add(PermissionConstants.MERCH_MANAGE);
            return permissions;
        }

        if (role.equals("publicity") || role.equals("sustainability")
                || role.equals("men captain") || role.equals("women captain") || role.equals("beginner captain")) {
            permissions.add(PermissionConstants.NEWS_MANAGE);
            return permissions;
        }

        return permissions;
    }
}
