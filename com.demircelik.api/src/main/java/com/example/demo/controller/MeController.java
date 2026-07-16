package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.security.AccessControlService;
import com.example.demo.security.ResourcePermissions;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Mobil uygulamanın "bu kullanıcı hangi modülleri görebilir?" sorusuna
 * cevap verdiği tek nokta. Rol matrisini (ResourcePermissions) VE
 * onaylanmış erişim taleplerini (AccessControlService) birleştirip
 * güncel, o ana ait yetki listesini döner.
 *
 * Mobil taraf rol adına bakarak kendi kendine karar vermez —
 * sadece bu endpoint'in söylediğini gösterir. Gerçek yetkilendirme
 * yine her endpoint'teki assertAccess() ile korunur; bu endpoint
 * sadece "hangi butonları göstereyim" sorusuna cevap verir.
 */
@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class MeController {

    private final AccessControlService accessControlService;

    @GetMapping("/permissions")
    public Map<String, Object> getPermissions(@AuthenticationPrincipal User currentUser) {
        Set<String> allowed = ResourcePermissions.allResources().stream()
                .filter(resource -> accessControlService.canAccess(currentUser, resource))
                .collect(Collectors.toSet());

        Map<String, Object> body = new HashMap<>();
        body.put("role", currentUser.getRole());
        body.put("name", currentUser.getUsername());
        body.put("resources", allowed);
        return body;
    }
}