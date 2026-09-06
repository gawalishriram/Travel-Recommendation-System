package com.example.dto;

import java.util.List;

public class DestinationPageResponse {

    private List<DestinationDTO> destinations;

    private int currentPage;

    private int totalPages;

    private long totalElements;

    private int pageSize;

    public DestinationPageResponse() {
    }

    public DestinationPageResponse(
            List<DestinationDTO> destinations,
            int currentPage,
            int totalPages,
            long totalElements,
            int pageSize) {

        this.destinations = destinations;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.pageSize = pageSize;
    }

    public List<DestinationDTO> getDestinations() {
        return destinations;
    }

    public void setDestinations(
            List<DestinationDTO> destinations) {

        this.destinations = destinations;
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
