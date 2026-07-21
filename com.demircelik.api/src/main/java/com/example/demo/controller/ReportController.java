package com.example.demo.controller;

import com.example.demo.dto.reports.*;
import com.example.demo.entity.User;
import com.example.demo.security.AccessControlService;
import com.example.demo.service.ReportEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportEngineService reportEngineService;
    private final AccessControlService accessControlService;

    @PostMapping("/run")
    public ReportResultDto runReport(@AuthenticationPrincipal User currentUser,
                                      @RequestBody ReportRequestDto request) {
        // Kullanıcının seçtiği kaynağa (orders, payments vb.) erişimi yoksa
        // mevcut ACCESS_DENIED akışı (mobil tarafta otomatik "İzin İste"
        // diyaloğu) burada da aynen devreye girer — ayrı bir mekanizma
        // kurmaya gerek kalmadı.
        accessControlService.assertAccess(currentUser, request.getResource());
        return reportEngineService.runReport(request);
    }

    // Mobil uygulamadaki ilk açılır menüyü doldurur. Kullanıcıya
    // "hangi verinin raporunu almak istersin" seçeneklerini sunar

    @GetMapping("/schema/{resource}")
    public List<FieldMeta> getSchema(@PathVariable String resource) {
        return ReportSchemaRegistry.getSchema(resource);
    }

    //  Kullanıcı bir kaynak seçtiğinde devreye girer. Bu metot ilgili tablonun kolonlarını
    // FieldMeta listesi olarak döner. Mobil uygulama da bu kolonlara göre ekrana filtreleme kutucukları
    //  (checkbox,input) çizer.
    
    @GetMapping("/resources")
    public List<String> getAvailableResources() {
        return new ArrayList<>(ReportSchemaRegistry.availableResources());
    }
}