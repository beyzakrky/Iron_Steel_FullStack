package com.example.demo.security;

import com.example.demo.entity.AccessRequest;
import com.example.demo.entity.User;
import com.example.demo.exception.AccessDeniedException;
import com.example.demo.repository.AccessRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AccessControlService {

    private final AccessRequestRepository accessRequestRepository;

    /**
     * Kullanıcının bir kaynağa erişip erişemeyeceğini söyler.
     * Sıra: 
     * 1) Rolün varsayılan yetkisi var mı? 
     *  2) Onaylı ve süresi
     * geçmemiş bir erişim talebi var mı?
     */

    
    public boolean canAccess(User user, String resource) {
        if (ResourcePermissions.hasDefaultAccess(user.getRole(), resource)) {
            return true;
        }

        return accessRequestRepository
                .findFirstByRequesterIdAndResourceAndStatusOrderByDecidedAtDesc(
                        user.getId(), resource, "APPROVED")
                .filter(req -> req.getExpiresAt() == null
                        || req.getExpiresAt().isAfter(LocalDateTime.now()))
                .isPresent();
    }
    

    /**
     * Controller'larda tek satırla kullanılır: erişim yoksa 403 fırlatır.
     * Örnek: accessControlService.assertAccess(currentUser, "orders");
     */
    
    public void assertAccess(User user, String resource) {
        if (!canAccess(user, resource)) {
            throw new AccessDeniedException(resource);
        }
    }
}
