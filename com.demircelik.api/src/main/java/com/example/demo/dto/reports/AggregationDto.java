package com.example.demo.dto.reports;

import lombok.Data;

@Data
public class AggregationDto {
    private String field; // orn. totalAmount
    private String function; // SUM | COUNT | AVG | MIN | MAX
    private String alias; // opsiyonel: boşsa otomatil üretilir
}

// Mobil taraftan gelen "şu veriyi topla, ortalama al" 
// gibi istekleri Spring Boot'un anlayacağı bir formata çeviri

// filed: hangi kolon üzerinde işlem yapılacağını söyler 
// function: o kolon üzerinde hangi matematiksel işlemin yapılacağını belirtir
// alias: Dönen sonucun JSON içinde hangi isimle görüneceğini belirtir.Örneğin sonuç SUM(amount) değil de
// ToplamKazanc gibi bir isimle dönebilir.