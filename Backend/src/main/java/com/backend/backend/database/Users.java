package com.backend.backend.database;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(
        name = "user_auth",
        uniqueConstraints = @UniqueConstraint(columnNames = "email")
)
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    // AUTO CREATE TIME
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // AUTO UPDATE TIME
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Normalize email automatically
    @PrePersist
    @PreUpdate
    public void normalizeEmail() {
        if (email != null) {
            email = email.trim().toLowerCase();
        }
    }
}
