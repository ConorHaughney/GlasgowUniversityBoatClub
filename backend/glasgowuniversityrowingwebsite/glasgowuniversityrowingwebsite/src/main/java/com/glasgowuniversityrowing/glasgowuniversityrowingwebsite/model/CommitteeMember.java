package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "committee")
public class CommitteeMember {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private String name;
    @Column(nullable = false, unique = true) private String role;
    @Column(columnDefinition = "TEXT") private String bio;
    @Column(name = "image_url") private String imageUrl;
    @Column(name = "display_order") private Integer order;
    @Column private String email;

    public CommitteeMember() {}

    public CommitteeMember(String name, String role, String bio, String imageUrl, Integer order, String email) {
        this.name = name;
        this.role = role;
        this.bio = bio;
        this.imageUrl = imageUrl;
        this.order = order;
        this.email = email;
    }
}