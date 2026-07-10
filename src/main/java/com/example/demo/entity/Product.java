package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "product_type")
    private String productType;

    @Column(name = "steel_quality")
    private String steelQuality;

    @Column(name = "thickness_mm")
    private BigDecimal thicknessMm;

    @Column(name = "stock_tons")
    private BigDecimal stockTons;

    @Column(name = "price_per_ton", nullable = false)
    private BigDecimal pricePerTon;
}