package com.example.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@travelai.com}")
    private String senderEmail;

    @Override
    public void sendOtpEmail(String toEmail, String recipientName, String otpCode) {
        String cleanName = (recipientName != null && !recipientName.isBlank()) ? recipientName : "Valued Traveler";

        try {
            if (mailSender != null) {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(senderEmail, "TravelAI Security");
                helper.setTo(toEmail);
                helper.setSubject("TravelAI - Your Password Reset Verification Code: " + otpCode);

                String htmlContent = buildOtpHtmlContent(cleanName, otpCode);
                helper.setText(htmlContent, true);

                mailSender.send(message);
                logger.info("[EMAIL SENT SUCCESS] OTP verification email successfully sent to: {}", toEmail);
            } else {
                logger.warn("[EMAIL SENDER UNAVAILABLE] JavaMailSender is not configured. Falling back to console logging.");
            }
        } catch (Exception e) {
            logger.error("[EMAIL SEND ERROR] Failed to send OTP email to: {}. Error: {}", toEmail, e.getMessage());
        }

        // Always log for debugging / dev convenience
        System.out.println("==================================================================");
        System.out.println("[EMAIL NOTIFICATION DISPATCHED]");
        System.out.println("TO: " + toEmail);
        System.out.println("SUBJECT: TravelAI - Password Reset Verification Code");
        System.out.println("VERIFICATION CODE: " + otpCode);
        System.out.println("EXPIRY: 15 minutes");
        System.out.println("==================================================================");
    }

    private String buildOtpHtmlContent(String name, String otp) {
        return "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<meta charset='UTF-8'>"
                + "<style>"
                + "  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333; }"
                + "  .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e9ecef; }"
                + "  .header { background: linear-gradient(135deg, #0062ff 0%, #00c6ff 100%); padding: 32px 24px; text-align: center; color: #ffffff; }"
                + "  .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }"
                + "  .content { padding: 32px 28px; }"
                + "  .greeting { font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 12px; }"
                + "  .message { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px; }"
                + "  .otp-box { background: #f0f7ff; border: 2px dashed #0062ff; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }"
                + "  .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0062ff; margin: 8px 0; font-family: 'Courier New', Courier, monospace; }"
                + "  .otp-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600; }"
                + "  .expiry-note { font-size: 13px; color: #ef4444; font-weight: 600; margin-top: 10px; }"
                + "  .security-tip { background: #f8fafc; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 6px; font-size: 13px; color: #64748b; line-height: 1.5; margin-top: 20px; }"
                + "  .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e9ecef; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "  <div class='container'>"
                + "    <div class='header'>"
                + "      <h1>TravelAI</h1>"
                + "      <p style='margin: 4px 0 0 0; opacity: 0.9; font-size: 14px;'>Smart Travel & Vacation Management</p>"
                + "    </div>"
                + "    <div class='content'>"
                + "      <div class='greeting'>Hello " + name + ",</div>"
                + "      <div class='message'>We received a request to reset the password for your TravelAI account. Please use the 6-digit verification code below to complete the verification process:</div>"
                + "      <div class='otp-box'>"
                + "        <div class='otp-label'>Your 6-Digit Verification Code</div>"
                + "        <div class='otp-code'>" + otp + "</div>"
                + "        <div class='expiry-note'>&#9201; Valid for 15 minutes only</div>"
                + "      </div>"
                + "      <div class='security-tip'>"
                + "        <strong>Security Notice:</strong> If you did not request this verification code, please ignore this email or update your password immediately. Never share this code with anyone."
                + "      </div>"
                + "    </div>"
                + "    <div class='footer'>"
                + "      &copy; 2026 TravelAI Platform. All rights reserved.<br>This is an automated security notification."
                + "    </div>"
                + "  </div>"
                + "</body>"
                + "</html>";
    }
}