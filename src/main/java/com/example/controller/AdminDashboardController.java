package com.example.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.AdminDashboardResponse;
import com.example.service.AdminDashboardService;

@RestController
@RequestMapping("/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;


    public AdminDashboardController(
            AdminDashboardService dashboardService) {

        this.dashboardService =
                dashboardService;
    }


    @GetMapping("/summary")
    public ResponseEntity<AdminDashboardResponse>
            getDashboardSummary() {

        AdminDashboardResponse response =
                dashboardService
                        .getDashboardSummary();

        return ResponseEntity.ok(response);
    }
}