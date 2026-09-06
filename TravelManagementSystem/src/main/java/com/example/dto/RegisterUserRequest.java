package com.example.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterUserRequest {

    @NotBlank(message = "Name is required")
    @Size(
        min = 3,
        max = 100,
        message = "Name must be between 3 and 100 characters"
    )
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter valid email")
    private String email;

    @NotBlank(message = "Mobile number is required")
    @Pattern(
        regexp = "^[6-9][0-9]{9}$",
        message = "Enter valid mobile number"
    )
    private String mobile;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Password is required")
    @Size(
        min = 6,
        message = "Password must contain at least 6 characters"
    )
    private String password;

    @NotBlank(message = "Address is required")
    private String address;

    public RegisterUserRequest() {
    }

    public RegisterUserRequest(
            String name,
            String email,
            String mobile,
            String gender,
            String password,
            String address) {

        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.gender = gender;
        this.password = password;
        this.address = address;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name =
                name == null
                        ? null
                        : name.trim();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email =
                email == null
                        ? null
                        : email.trim().toLowerCase();
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile =
                mobile == null
                        ? null
                        : mobile.trim();
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender =
                gender == null
                        ? null
                        : gender.trim();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address =
                address == null
                        ? null
                        : address.trim();
    }
}