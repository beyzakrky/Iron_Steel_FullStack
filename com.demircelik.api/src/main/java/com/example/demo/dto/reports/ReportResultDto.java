package com.example.demo.dto.reports;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class ReportResultDto {
    private List<String> columns;
    private List<Map<String, Object>> rows;
}