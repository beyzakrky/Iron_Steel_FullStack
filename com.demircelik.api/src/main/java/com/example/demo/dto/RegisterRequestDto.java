package com.example.demo.dto;

import lombok.Data;

@Data
public class RegisterRequestDto {
    private String username;
    private String email;
    private String password;
    private String role; // "DIRECTOR" | "SALES_REP | "INTERN"
}
