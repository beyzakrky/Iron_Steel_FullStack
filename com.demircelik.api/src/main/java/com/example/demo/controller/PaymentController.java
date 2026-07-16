package com.example.demo.controller;

import com.example.demo.entity.Payment;
import com.example.demo.entity.User;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.security.AccessControlService;
import lombok.RequiredArgsConstructor; 
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final AccessControlService accessControlService;
    private final PaymentRepository paymentRepository;

    @GetMapping
    public List<Payment> getPayments(@AuthenticationPrincipal User currentUser) {
        // ResourcePermissions.java'daki matrise göre 
        // "payments" şu an sadece DIRECTOR'a açık

        accessControlService.assertAccess(currentUser, "payment");
        return paymentRepository.findAll();
    }
}