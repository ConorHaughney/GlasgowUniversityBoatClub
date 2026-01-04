package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.MailingListRequest;

@Service
public class MailingListService {

    @Value("${mailchimp.api.key}")
    private String apiKey;

    @Value("${mailchimp.list.id}")
    private String listId;

    @Value("${mailchimp.server.prefix}")
    private String serverPrefix;

    private final RestTemplate restTemplate = new RestTemplate();

    public void subscribe(MailingListRequest request) {
        // Construct the Mailchimp API URL
        String url = "https://" + serverPrefix + ".api.mailchimp.com/3.0/lists/" + listId + "/members";

        // Set headers (Basic Auth uses the API key as the password)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth("user", apiKey);

        // Create the request body
        Map<String, Object> body = new HashMap<>();
        body.put("email_address", request.getEmail());
        body.put("status", "subscribed");

        Map<String, String> mergeFields = new HashMap<>();
        mergeFields.put("FNAME", request.getFirstName());
        mergeFields.put("LNAME", request.getLastName());
        body.put("merge_fields", mergeFields);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            restTemplate.postForEntity(url, entity, String.class);
        } catch (HttpClientErrorException e) {
            String errorBody = e.getResponseBodyAsString();
            if (errorBody != null && errorBody.contains("Member Exists")) {
                throw new RuntimeException("This email is already subscribed.");
            }
            throw new RuntimeException("Failed to subscribe to mailing list.");
        } catch (Exception e) {
            System.err.println("Error subscribing to Mailchimp: " + e.getMessage());
            throw new RuntimeException("Failed to subscribe to mailing list");
        }
    }
}