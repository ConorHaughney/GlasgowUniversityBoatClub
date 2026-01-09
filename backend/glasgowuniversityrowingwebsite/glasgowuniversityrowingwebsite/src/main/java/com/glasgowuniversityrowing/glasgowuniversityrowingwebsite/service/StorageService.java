package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class StorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service.role.key}")
    private String supabaseKey;

    @Value("${supabase.committee.bucket}")
    private String committeeBucket;

    @Value("${supabase.news.bucket}")
    private String newsBucket;

    @Value("${supabase.merch.bucket}")
    private String merchBucket;

    private final RestTemplate restTemplate = new RestTemplate();

    public String uploadNewsImage(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID().toString() + "-" + StringUtils.cleanPath(file.getOriginalFilename());
        String url = supabaseUrl + "/storage/v1/object/" + newsBucket + "/" + filename;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + supabaseKey);

        String contentType = file.getContentType();
        headers.setContentType(StringUtils.hasText(contentType) ? MediaType.parseMediaType(contentType)
                : MediaType.APPLICATION_OCTET_STREAM);

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

        restTemplate.postForEntity(url, requestEntity, String.class);

        return supabaseUrl + "/storage/v1/object/public/" + newsBucket + "/" + filename;
    }

    public String uploadMerchImage(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID().toString() + "-" + StringUtils.cleanPath(file.getOriginalFilename());
        String url = supabaseUrl + "/storage/v1/object/" + merchBucket + "/" + filename;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + supabaseKey);

        String contentType = file.getContentType();
        headers.setContentType(StringUtils.hasText(contentType) ? MediaType.parseMediaType(contentType)
                : MediaType.APPLICATION_OCTET_STREAM);

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

        restTemplate.postForEntity(url, requestEntity, String.class);

        return supabaseUrl + "/storage/v1/object/public/" + merchBucket + "/" + filename;
    }

    public String uploadPublic(String filename, MultipartFile file) {
        String url = supabaseUrl + "/storage/v1/object/" + committeeBucket + "/" + filename;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + supabaseKey);

        String contentType = file.getContentType();
        headers.setContentType(StringUtils.hasText(contentType) ? MediaType.parseMediaType(contentType)
                : MediaType.APPLICATION_OCTET_STREAM);

        try {
            HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);
            restTemplate.postForEntity(url, requestEntity, String.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to storage", e);
        }

        return supabaseUrl + "/storage/v1/object/public/" + committeeBucket + "/" + filename;
    }
}