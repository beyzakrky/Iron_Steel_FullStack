package com.example.demo.dto;

import lombok.Data;

@Data
public class CreateAccessRequestDto {
    private String resource; // "orders", "payments" vb.
    private String reason;   // kullanıcının gerekçesi (opsiyonel ama önerilir)
}