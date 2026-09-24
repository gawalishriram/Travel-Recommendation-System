package com.example.dto;

import java.sql.Timestamp;

public class UserAdminResponse {

    private Integer userId;

    private String name;

    private String email;

    private String mobile;

    private String gender;

    private String address;

    private Timestamp createdAt;

    public UserAdminResponse() {
    }

    public UserAdminResponse(
            Integer userId,
            String name,
            String email,
            String mobile,
            String gender,
            String address,
            Timestamp createdAt) {

        this.userId = userId;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.gender = gender;
        this.address = address;
        this.createdAt = createdAt;
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

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}