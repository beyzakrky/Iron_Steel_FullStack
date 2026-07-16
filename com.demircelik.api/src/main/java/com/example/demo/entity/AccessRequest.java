package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "access_requests")
@Data
public class AccessRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @Column(nullable = false)
    private String resource; // "orders", "payments", "financial_risk" vb.

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING | APPROVED | REJECTED

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(nullable = false)
    private LocalDateTime requestedAt = LocalDateTime.now();

    private LocalDateTime decidedAt;

    @ManyToOne
    @JoinColumn(name = "decided_by_id")
    private User decidedBy;

    private LocalDateTime expiresAt;
}