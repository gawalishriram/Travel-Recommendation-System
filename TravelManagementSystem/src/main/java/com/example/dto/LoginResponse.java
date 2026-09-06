package com.example.dto;

public class LoginResponse {

    private boolean success;
    private Integer userId;
    private String name;
    private String email;
    private String token;
    private String message;

    public LoginResponse() {
    }

    public LoginResponse(
            boolean success,
            Integer userId,
            String name,
            String email,
            String token,
            String message) {

        this.success = success;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.token = token;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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