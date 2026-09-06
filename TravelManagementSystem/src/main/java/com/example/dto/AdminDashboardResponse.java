package com.example.dto;

import java.util.List;

public class AdminDashboardResponse {

    private long totalUsers;

    private long totalDestinations;

    private long totalBookings;

    private long maleCount;

    private long femaleCount;

    private long otherGenderCount;

    private List<UserAdminResponse> loggedInUsers;


    public AdminDashboardResponse() {
    }


    public AdminDashboardResponse(
            long totalUsers,
            long totalDestinations,
            long totalBookings,
            long maleCount,
            long femaleCount,
            long otherGenderCount,
            List<UserAdminResponse> loggedInUsers) {

        this.totalUsers = totalUsers;
        this.totalDestinations = totalDestinations;
        this.totalBookings = totalBookings;
        this.maleCount = maleCount;
        this.femaleCount = femaleCount;
        this.otherGenderCount = otherGenderCount;
        this.loggedInUsers = loggedInUsers;
    }


    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalDestinations() {
        return totalDestinations;
    }

    public void setTotalDestinations(
            long totalDestinations) {

        this.totalDestinations = totalDestinations;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getMaleCount() {
        return maleCount;
    }

    public void setMaleCount(long maleCount) {
        this.maleCount = maleCount;
    }

    public long getFemaleCount() {
        return femaleCount;
    }

    public void setFemaleCount(long femaleCount) {
        this.femaleCount = femaleCount;
    }

    public long getOtherGenderCount() {
        return otherGenderCount;
    }

    public void setOtherGenderCount(
            long otherGenderCount) {

        this.otherGenderCount = otherGenderCount;
    }

    public List<UserAdminResponse> getLoggedInUsers() {
        return loggedInUsers;
    }

    public void setLoggedInUsers(
            List<UserAdminResponse> loggedInUsers) {

        this.loggedInUsers = loggedInUsers;
    }
}