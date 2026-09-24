package com.example.service;

public interface EmailService {

    void sendOtpEmail(String toEmail, String recipientName, String otpCode);
}