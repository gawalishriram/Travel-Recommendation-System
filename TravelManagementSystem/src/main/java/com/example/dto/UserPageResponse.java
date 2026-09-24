package com.example.dto;

import java.util.List;

public class UserPageResponse {

    private List<UserAdminResponse> users;

    private int currentPage;

    private int totalPages;

    private long totalElements;

    private int pageSize;

    public UserPageResponse() {
    }

    public UserPageResponse(
            List<UserAdminResponse> users,
            int currentPage,
            int totalPages,
            long totalElements,
            int pageSize) {

        this.users = users;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.pageSize = pageSize;
    }

    public List<UserAdminResponse> getUsers() {
        return users;
    }

    public void setUsers(
            List<UserAdminResponse> users) {

        this.users = users;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(
            int currentPage) {

        this.currentPage = currentPage;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(
            int totalPages) {

        this.totalPages = totalPages;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(
            long totalElements) {

        this.totalElements = totalElements;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(
            int pageSize) {

        this.pageSize = pageSize;
    }
}