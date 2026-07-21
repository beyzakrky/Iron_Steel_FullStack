package com.example.demo.controller;

import com.example.demo.dto.reports.RiskScoreDto;
import com.example.demo.entity.User;
import com.example.demo.security.AccessControlService;
import com.example.demo.service.RiskAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/risk-analysis")
@RequiredArgsConstructor
public class RiskAnalysisController {

    private final RiskAnalysisService riskAnalysisService;
    private final AccessControlService accessControlService;

    @GetMapping
    public List<RiskScoreDto> getRiskAnalysis(@AuthenticationPrincipal User currentUser) {
        // financial_risk zaten ResourcePermissions.java'da sadece Director'a 
        // açık. izin iste akışı normal devam
        accessControlService.assertAccess(currentUser, "financial_risk");
        return riskAnalysisService.analyzeAll();
    }
}