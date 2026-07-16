package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * NOT: Projenizde zaten bir @RestControllerAdvice sınıfı varsa (örn.
 * validasyon hatalarını yakalayan), bu dosyayı ayrı bırakmak yerine
 * oradaki @ExceptionHandler metodunu mevcut sınıfa taşıyın —
 * aynı anlamda iki tane RestControllerAdvice sorun çıkarmaz ama
 * karmaşayı önlemek için tek yerde toplamak daha temiz olur.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "ACCESS_DENIED");
        body.put("resource", ex.getResource());
        body.put("message", "Bu bölüm için direktörünüzden onay istemeniz gerekiyor.");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }
}