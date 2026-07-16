package com.example.demo.security;

import java.util.Map;
import java.util.Set;

/**
 * ROL → VARSAYILAN KAYNAK ERİŞİM MATRİSİ
 * ---------------------------------------
 * "Kaynak" (resource) burada bir tabloyu/modülü temsil eden serbest
 * bir isim — DB tablo adıyla birebir aynı olmak zorunda değil, ama
 * tutarlılık için aynı tutmanızı öneririm (customers, orders, ...).
 *
 * Yeni bir modül eklediğinizde SADECE bu dosyayı güncellemeniz yeterli;
 * kontrolcülerde tekrar tekrar rol kontrolü yazmanız gerekmez.
 */
public class ResourcePermissions {

    private static final Map<String, Set<String>> DEFAULT_ACCESS = Map.of(
            "DIRECTOR", Set.of(
                    "customers", "products", "orders", "order_items",
                    "campaigns", "payments", "visits", "sales_reps", "financial_risk"
            ),
            "SALES_REP", Set.of(
                    "customers", "products", "orders", "order_items", "campaigns", "visits"
            ),
            "INTERN", Set.of(
                    "customers"
            )
    );

    /** Bu rol, bu kaynağa VARSAYILAN olarak (onay talebi olmadan) erişebilir mi? */
    public static boolean hasDefaultAccess(String role, String resource) {
        return DEFAULT_ACCESS.getOrDefault(role, Set.of()).contains(resource);
    }

    public static Set<String> allResources() {
        return Set.of(
                "customers", "products", "orders", "order_items",
                "campaigns", "payments", "visits", "sales_reps", "financial_risk"
        );
    }
}