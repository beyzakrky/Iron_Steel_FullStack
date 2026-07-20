package com.example.demo.dto.reports;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FieldMeta {
    private String field; // örn: customer.companyName
    private String label; // örn. Müşteri
    private String type; // STRING | NUMBER |DATE
}