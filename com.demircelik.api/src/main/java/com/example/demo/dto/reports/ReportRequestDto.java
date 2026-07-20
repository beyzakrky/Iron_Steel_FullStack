package com.example.demo.dto.reports;

import lombok.Data;
import java.util.List;

@Data
public class ReportRequestDto {
    private String resource; // orders, customers, visits...
    private String groupByField; // örn: customer.companyName
    private List<AggregationDto> aggregations;
    private List<FilterDto> filters;
 }