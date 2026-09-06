package com.example.dto;

public class AdminLoginResponse {

    private boolean success;
    private Integer adminId;
    private String email;
    private String role;
    private String token;
    private String message;

    public AdminLoginResponse() {
    }

    public AdminLoginResponse(
            boolean success,
            Integer adminId,
            String email,
            String role,
            String token,
            String message) {

        this.success = success;
        this.adminId = adminId;
        this.email = email;
        this.role = role;
        this.token = token;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Integer getAdminId() {
        return adminId;
    }

    public void setAdminId(Integer adminId) {
        this.adminId = adminId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}