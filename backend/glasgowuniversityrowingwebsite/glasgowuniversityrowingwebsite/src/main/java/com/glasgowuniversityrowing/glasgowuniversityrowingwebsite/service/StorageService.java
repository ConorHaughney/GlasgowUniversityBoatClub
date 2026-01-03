package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service.role.key}")
    private String serviceRoleKey;

    @Value("${supabase.bucket}")
    private String bucket;

    private final RestTemplate rest = new RestTemplate();

    public String uploadPublic(String key, MultipartFile file) {
        try {
            String objectPath = bucket + "/" + key;
            String uploadUrl = supabaseUrl + "/storage/v1/object/" + objectPath;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + serviceRoleKey);
            headers.set("apikey", serviceRoleKey);
            headers.setContentType(MediaType.parseMediaType(file.getContentType()));
            HttpEntity<byte[]> req = new HttpEntity<>(file.getBytes(), headers);

            ResponseEntity<String> res = rest.exchange(uploadUrl, HttpMethod.PUT, req, String.class);
            if (!res.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Upload failed: " + res.getStatusCode());
            }
            return supabaseUrl + "/storage/v1/object/public/" + objectPath;
        } catch (Exception e) {
            throw new RuntimeException("Upload failed", e);
        }
    }
}