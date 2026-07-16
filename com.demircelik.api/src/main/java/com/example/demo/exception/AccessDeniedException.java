package com.example.demo.exception;

/**
 * Kullanıcı yetkisi olmayan bir kaynağa erişmeye çalıştığında fırlatılır.
 * GlobalExceptionHandler bunu yakalayıp mobil uygulamanın anlayacağı
 * yapıda bir 403 cevabına çevirir.
 */
public class AccessDeniedException extends RuntimeException {

    private final String resource;

    public AccessDeniedException(String resource) {
        super("Bu kaynağa erişim yetkiniz yok: " + resource);
        this.resource = resource;
    }

    public String getResource() {
        return resource;
    }
}