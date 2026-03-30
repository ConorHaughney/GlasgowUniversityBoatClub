package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.User;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class PasswordResetEmailService {

    private final JavaMailSender javaMailSender;
    private final String fromAddress;
    private final String frontendUrl;

    public PasswordResetEmailService(
            JavaMailSender javaMailSender,
            @Value("${app.email.from:${spring.mail.username}}") String fromAddress,
            @Value("${frontend.url:http://localhost:3000}") String frontendUrl) {
        this.javaMailSender = javaMailSender;
        this.fromAddress = fromAddress;
        this.frontendUrl = frontendUrl;
    }

    public void sendPasswordResetEmail(User user, String token) {
      String resetLink = frontendUrl + "/admin/reset-password?token=" + token;
        String subject = "Reset your GUBC admin password";
        String html = """
                <div style=\"background:#000000;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#ffffff;\">
                  <div style=\"max-width:600px;margin:0 auto;background:#111111;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;\">
                    <div style=\"background:#ffdc36;color:#000000;padding:18px 24px;font-size:20px;font-weight:700;\">Glasgow University Boat Club</div>
                    <div style=\"padding:24px;line-height:1.6;\">
                      <p style=\"margin:0 0 14px 0;\">Hi,</p>
                      <p style=\"margin:0 0 14px 0;\">We received a request to reset your admin password.</p>
                      <p style=\"margin:0 0 22px 0;\">Use the button below to set a new password. This link expires in 1 hour.</p>
                      <a href=\"%s\" style=\"display:inline-block;background:#ffdc36;color:#000000;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700;\">Reset Password</a>
                      <p style=\"margin:22px 0 0 0;color:#d2d2d2;font-size:13px;\">If you did not request this, you can ignore this email.</p>
                    </div>
                  </div>
                </div>
                """.formatted(resetLink);

        sendHtmlEmail(user.getEmail(), subject, html);
    }

    public void sendPasswordResetConfirmationEmail(User user) {
        String subject = "Your GUBC admin password was changed";
        String html = """
                <div style=\"background:#000000;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#ffffff;\">
                  <div style=\"max-width:600px;margin:0 auto;background:#111111;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;\">
                    <div style=\"background:#ffdc36;color:#000000;padding:18px 24px;font-size:20px;font-weight:700;\">Glasgow University Boat Club</div>
                    <div style=\"padding:24px;line-height:1.6;\">
                      <p style=\"margin:0 0 14px 0;\">Hi,</p>
                      <p style=\"margin:0 0 14px 0;\">Your admin password has been successfully reset.</p>
                      <p style=\"margin:0;color:#d2d2d2;font-size:13px;\">If this was not you, contact support immediately and change your password again.</p>
                    </div>
                  </div>
                </div>
                """;

        sendHtmlEmail(user.getEmail(), subject, html);
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setFrom(fromAddress);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            javaMailSender.send(message);
        } catch (MessagingException ex) {
            throw new RuntimeException("Unable to send password reset email", ex);
        }
    }
}
