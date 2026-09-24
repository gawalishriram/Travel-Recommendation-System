package com.example.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.model.User;

@Repository
public interface UserRepository
        extends JpaRepository<User, Integer> {

    boolean existsByEmail(String email);

    boolean existsByMobile(String mobile);

    Optional<User> findByEmail(String email);

    boolean existsByEmailAndUserIdNot(
            String email,
            Integer userId
    );

    boolean existsByMobileAndUserIdNot(
            String mobile,
            Integer userId
    );

    long countByGenderIgnoreCase(String gender);

    List<User> findByLastLoginAtIsNotNullOrderByLastLoginAtDesc();

    Optional<User> findByResetToken(String resetToken);
}