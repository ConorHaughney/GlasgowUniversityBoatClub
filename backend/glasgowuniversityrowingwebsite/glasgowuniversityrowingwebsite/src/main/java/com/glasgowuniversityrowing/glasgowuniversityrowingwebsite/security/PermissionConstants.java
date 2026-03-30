package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.security;

import java.util.Set;

public final class PermissionConstants {

    public static final String NEWS_MANAGE = "NEWS_MANAGE";
    public static final String EVENTS_MANAGE = "EVENTS_MANAGE";
    public static final String MERCH_MANAGE = "MERCH_MANAGE";
    public static final String COMMITTEE_MANAGE = "COMMITTEE_MANAGE";
    public static final String USER_ADMIN = "USER_ADMIN";
    public static final String RESET_LINKS_ADMIN = "RESET_LINKS_ADMIN";

    public static final Set<String> ALL = Set.of(
            NEWS_MANAGE,
            EVENTS_MANAGE,
            MERCH_MANAGE,
            COMMITTEE_MANAGE,
            USER_ADMIN,
            RESET_LINKS_ADMIN
    );

    private PermissionConstants() {
    }
}
