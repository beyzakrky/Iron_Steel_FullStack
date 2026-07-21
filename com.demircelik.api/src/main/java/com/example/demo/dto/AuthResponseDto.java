package com.example.demo.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class AuthResponseDto {
    private String token;
    private String role;
    private String name;
}

// DTO -Data Transfer Object - Veri Transfer Nesnesi 
// DTO'lar veritabanı nesnelerini (entity) olduğu gibi
// dışa açmak yerine, sadece istemcinin (burada bizim mobil uygulamamız oluyor)
// ihtiyacı olan verileri paketleyip gönderiyor.

// @Data lombok kütüphanesinde kullanılan, arkaplanda tüm getter-setterları otomatik olarak yazar.

// Kullanıcı e-posta ve şifresini doğru girdiğinde bir JWT token üretiyor, 
// kullanıcının rolünü ve adını bir pakete koyuyor.