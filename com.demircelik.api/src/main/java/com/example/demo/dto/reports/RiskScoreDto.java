package com.example.demo.dto.reports;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class RiskScoreDto {
    private Long customerId;
    private String companyName;
    private String city;
    private BigDecimal totalDebt;
    private BigDecimal overdueDebt;
    private BigDecimal creditLimit;
    private Long daysSinceLastOrder; // -1 = hiç sipariş yok
    private Long daysSincePayment; // -1 = hiç ödeme yok
    private double riskScore; // 0-100
    private String riskLevel; // DÜŞÜK | ORTA | YÜKSEK
}