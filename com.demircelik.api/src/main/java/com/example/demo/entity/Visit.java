package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "visits")
@Data
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sales_rep_id")
    private User salesRep;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(name = "visit_date")
    private LocalDateTime visitDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "next_action")
    private String nextAction;
}