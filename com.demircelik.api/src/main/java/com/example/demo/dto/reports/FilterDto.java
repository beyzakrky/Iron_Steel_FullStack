package com.example.demo.dto.reports;

import lombok.Data;
import java.util.List;

@Data
public class FilterDto {
    private String field; // örn. orderDate
    private String operator; // EQUALS | GT | LT | GTE | LTE | BETWEEN | LIKE | IN
    private List<String> value;
}