package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "customers")
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "tax_number", unique = true, length = 11)
    private String taxNumber;

    @Column(name = "total_debt")
    private BigDecimal totalDebt;

    @Column(name = "overdue_debt")
    private BigDecimal overdueDebt;

    @Column(name = "credit_limit")
    private BigDecimal creditLimit;

    private String city;
}