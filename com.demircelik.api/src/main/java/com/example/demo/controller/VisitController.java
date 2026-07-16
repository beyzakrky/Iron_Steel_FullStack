package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.entity.Visit;
import com.example.demo.repository.VisitRepository;
import com.example.demo.security.AccessControlService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/visits")
@RequiredArgsConstructor
public class VisitController {

    private final AccessControlService accessControlService;
    private final VisitRepository visitRepository;

    @GetMapping
    public List<Visit> getVisits(@AuthenticationPrincipal User currentUser) {
        accessControlService.assertAccess(currentUser, "visits");

        // Direktör hepsini görür; Satış temsilcisi sadece kendi ziyaretlerini görür.
        if ("DIRECTOR".equals(currentUser.getRole())) {
            return visitRepository.findAll();
        }
        return visitRepository.findBySalesRepId(currentUser.getId());
    }
}