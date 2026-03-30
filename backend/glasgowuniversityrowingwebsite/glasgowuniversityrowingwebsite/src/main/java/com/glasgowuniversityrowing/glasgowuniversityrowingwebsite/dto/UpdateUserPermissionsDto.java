package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto;

import java.util.Set;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserPermissionsDto {
    private boolean overrideEnabled;
    private Set<String> permissions;
}
