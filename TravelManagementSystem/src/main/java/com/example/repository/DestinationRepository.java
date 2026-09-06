package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.model.Destination;

public interface DestinationRepository
        extends JpaRepository<Destination, Integer> {

}