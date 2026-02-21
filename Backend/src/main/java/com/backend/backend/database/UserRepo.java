package com.backend.backend.database;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<Users, Long> {

    boolean existsByEmail(String email);

    Optional<Users> findByEmail(String email);
}