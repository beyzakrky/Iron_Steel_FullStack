package com.example.demo.service;

import com.example.demo.dto.reports.RiskScoreDto;
import com.example.demo.entity.Customer;
import com.example.demo.entity.Order;
import com.example.demo.entity.Payment;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

/**
 * KURAL/AĞIRLIK TABANLI RİSK SKORLAMA
 * ------------------------------------
 * Bu bir ML modeli DEĞİL — ağırlıklı, açıklanabilir bir istatistiksel
 * skorlama. Bilinçli bir tercih: elimizdeki müşteri sayısı bir ML
 * modelini anlamlı şekilde eğitmeye yetmiyor. Veri büyüdükçe, burada
 * hesaplanan aynı sinyaller (gecikme oranı, limit kullanımı, sipariş/
 * ödeme sıklığı) gerçek bir sınıflandırıcının feature'ları olarak
 * doğrudan kullanılabilir.
 */
@Service
@RequiredArgsConstructor
public class RiskAnalysisService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    private static final double W_OVERDUE_RATIO = 0.40;
    private static final double W_UTILIZATION = 0.25;
    private static final double W_ORDER_RECENCY = 0.15;
    private static final double W_PAYMENT_RECENCY = 0.20;

    // Bu gün sayısının üzerinde ilgili sinyal %100 riske ulaşır
    private static final long ORDER_RECENCY_CAP_DAYS = 180;
    private static final long PAYMENT_RECENCY_CAP_DAYS = 90;

    public List<RiskScoreDto> analyzeAll() {
        List<Customer> customers = customerRepository.findAll();
        List<RiskScoreDto> results = new ArrayList<>();

        for (Customer c : customers) {
            results.add(analyzeCustomer(c));
        }

        results.sort(Comparator.comparingDouble(RiskScoreDto::getRiskScore).reversed());
        return results;
    }

    private RiskScoreDto analyzeCustomer(Customer c) {
        BigDecimal creditLimit = (c.getCreditLimit() != null && c.getCreditLimit().compareTo(BigDecimal.ZERO) > 0)
                ? c.getCreditLimit() : BigDecimal.ONE;
        BigDecimal totalDebt = c.getTotalDebt() != null ? c.getTotalDebt() : BigDecimal.ZERO;
        BigDecimal overdueDebt = c.getOverdueDebt() != null ? c.getOverdueDebt() : BigDecimal.ZERO;

        double overdueRatio = clamp01(overdueDebt.divide(creditLimit, 4, RoundingMode.HALF_UP).doubleValue());
        double utilizationRatio = clamp01(totalDebt.divide(creditLimit, 4, RoundingMode.HALF_UP).doubleValue());

        Optional<Order> lastOrder = orderRepository.findTopByCustomerIdOrderByOrderDateDesc(c.getId());
        long daysSinceLastOrder = lastOrder.map(o ->
                ChronoUnit.DAYS.between(o.getOrderDate(), LocalDateTime.now())
        ).orElse(-1L);
        double orderRecencyScore = daysSinceLastOrder < 0
                ? 1.0
                : clamp01(daysSinceLastOrder / (double) ORDER_RECENCY_CAP_DAYS);

        Optional<Payment> lastPayment = paymentRepository.findTopByCustomerIdOrderByPaymentDateDesc(c.getId());
        long daysSincePayment = lastPayment.map(p ->
                ChronoUnit.DAYS.between(p.getPaymentDate(), LocalDateTime.now())
        ).orElse(-1L);

        double paymentRecencyScore;
        if (totalDebt.compareTo(BigDecimal.ZERO) <= 0) {
            paymentRecencyScore = 0.0; // borcu yok, bu sinyalden risk gelmez
        } else if (daysSincePayment < 0) {
            paymentRecencyScore = 1.0; // borcu var ama hiç ödeme kaydı yok
        } else {
            paymentRecencyScore = clamp01(daysSincePayment / (double) PAYMENT_RECENCY_CAP_DAYS);
        }

        double score = 100 * (
                W_OVERDUE_RATIO * overdueRatio +
                W_UTILIZATION * utilizationRatio +
                W_ORDER_RECENCY * orderRecencyScore +
                W_PAYMENT_RECENCY * paymentRecencyScore
        );
        score = Math.round(score * 10) / 10.0;

        String level = score >= 60 ? "YÜKSEK" : score >= 30 ? "ORTA" : "DÜŞÜK";

        return new RiskScoreDto(
                c.getId(), c.getCompanyName(), c.getCity(),
                totalDebt, overdueDebt, c.getCreditLimit(),
                daysSinceLastOrder, daysSincePayment,
                score, level
        );
    }

    private double clamp01(double v) {
        return Math.max(0, Math.min(1, v));
    }
}