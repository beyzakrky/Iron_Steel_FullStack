package com.example.demo.dto.reports;

import java.util.*;

/***
 * Her resource için hangi alanların raporlanabilir olduğunu tanımlar.
 * Frontend, kullanıcıya dropdown/chip listesi göstermeden önce
 * bunu GET /api/reports/schema/{resource} ile çeker.
 * 
 * Burada yer alan 'field' değerleri entity adları ile eşleşmeli 
 * (Product.java, Order.java gibi) 
 */

public class ReportSchemaRegistry {
    private static final Map<String, List<FieldMeta>> SCHEMAS = new LinkedHashMap<>();

    static {
        SCHEMAS.put("orders", List.of(
            new FieldMeta("customer.companyName", "Müşteri", "STRING"),
            new FieldMeta("customer.city", "Şehir", "STRING"),
            new FieldMeta("deliveryStatus", "Teslimat Durumu", "STRING"),
            new FieldMeta("paymentStatus", "Ödeme Durumu", "STRING"),
            new FieldMeta("totalAmount", "Toplam Tutar", "NUMBER"),
            new FieldMeta("orderDate", "Sipariş Tarihi", "DATE")
        ));

        SCHEMAS.put("customers", List.of(
            new FieldMeta("city", "Şehir", "STRING"),
            new FieldMeta("totalDebt", "TotalBorç", "NUMBER"),
            new FieldMeta("overdueDebt", "Gecikmiş Borç", "NUMBER")
        ));

        SCHEMAS.put("products", List.of(
            new FieldMeta("productType", "Ürün Tipi", "STRING"),
            new FieldMeta("steelQuality", "Çelik Kalitesi", "STRING"),
            new FieldMeta("stockTons", "Stok (Ton)", "NUMBER"),
            new FieldMeta("pricePerTon", "Ton Fiyatı", "NUMBER")
        ));

        SCHEMAS.put("visits", List.of(
            new FieldMeta("customer.companyName", "Müşteri", "STRING"),
            new FieldMeta("visitDate", "Ziyaret Tarihi", "DATE")
        ));

        SCHEMAS.put("payments", List.of(
            new FieldMeta("customer.companyName", "Müşteri", "STRING"),
            new FieldMeta("paymentMethod", "Ödeme Yöntemi", "STRING"),
            new FieldMeta("amount", "Tutar", "NUMBER"),
            new FieldMeta("paymentDate", "Ödeme Tarihi", "DATE")
        ));
    }

    public static List<FieldMeta> getSchema(String resource) {
        return SCHEMAS.getOrDefault(resource, List.of());
    }

    public static Set<String> availableResources() {
        return SCHEMAS.keySet();
    }
}