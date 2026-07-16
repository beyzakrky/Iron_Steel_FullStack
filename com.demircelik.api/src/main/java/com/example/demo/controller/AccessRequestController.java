package com.example.demo.controller;

import com.example.demo.dto.CreateAccessRequestDto;
import com.example.demo.entity.AccessRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.AccessRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/access-requests")
@RequiredArgsConstructor
public class AccessRequestController {

    private final AccessRequestRepository accessRequestRepository;

    // --- Satış temsilcisi / stajyer: yeni bir erişim talebi oluşturur ---
    @PostMapping
    public AccessRequest createRequest(@AuthenticationPrincipal User currentUser,
                                        @RequestBody CreateAccessRequestDto dto) {
        AccessRequest request = new AccessRequest();
        request.setRequester(currentUser);
        request.setResource(dto.getResource());
        request.setReason(dto.getReason());
        request.setStatus("PENDING");
        request.setRequestedAt(LocalDateTime.now());
        return accessRequestRepository.save(request);
    }

    // --- Herkes: kendi taleplerinin durumunu görür (Bekliyor/Onaylandı/Reddedildi) ---
    @GetMapping("/mine")
    public List<AccessRequest> myRequests(@AuthenticationPrincipal User currentUser) {
        return accessRequestRepository.findByRequesterIdOrderByRequestedAtDesc(currentUser.getId());
    }

    // --- Sadece DIRECTOR: bekleyen tüm talepleri görür ---
    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('DIRECTOR')")
    public List<AccessRequest> getPending() {
        return accessRequestRepository.findByStatus("PENDING");
    }

    // --- Sadece DIRECTOR: talebi onaylar (varsayılan 7 gün geçerli) ---
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('DIRECTOR')")
    public AccessRequest approve(@PathVariable Long id, @AuthenticationPrincipal User director) {
        AccessRequest req = findOrThrow(id);
        req.setStatus("APPROVED");
        req.setDecidedBy(director);
        req.setDecidedAt(LocalDateTime.now());
        req.setExpiresAt(LocalDateTime.now().plusDays(7)); // süreyi ihtiyacınıza göre değiştirin
        return accessRequestRepository.save(req);
    }

    // --- Sadece DIRECTOR: talebi reddeder ---
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('DIRECTOR')")
    public AccessRequest reject(@PathVariable Long id, @AuthenticationPrincipal User director) {
        AccessRequest req = findOrThrow(id);
        req.setStatus("REJECTED");
        req.setDecidedBy(director);
        req.setDecidedAt(LocalDateTime.now());
        return accessRequestRepository.save(req);
    }

    private AccessRequest findOrThrow(Long id) {
        return accessRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Talep bulunamadı"));
    }
}