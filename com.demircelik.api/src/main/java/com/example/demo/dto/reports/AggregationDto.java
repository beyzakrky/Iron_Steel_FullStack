package com.example.demo.dto.reports;

import lombok.Data;

@Data
public class AggregationDto {
    private String field; // orn. totalAmount
    private String function; // SUM | COUNT | AVG | MIN | MAX
    private String alias; // opsiyonel: boşsa otomatil üretilir
}