package com.backend.backend.database;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<Users, Long> {

    boolean existsByEmail(String email);

}