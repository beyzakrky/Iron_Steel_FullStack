package com.example.demo.service;

import com.example.demo.dto.reports.*;
import com.example.demo.entity.*;
import com.example.demo.entity.Order;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Kullanıcının seçtiği kaynak/grupla/topla/filtrele kombinasyonunu,
 * çalışma zamanında bir JPA Criteria sorgusuna çevirir.
 *
 * Güvenlik notu: raw SQL string birleştirme YAPILMIYOR. Her alan adı
 * gerçek entity path'lerine (root.get(...)) karşı çözülüyor — olmayan
 * bir alan istenirse Hibernate IllegalArgumentException fırlatır,
 * çalıştırılabilir bir SQL enjekte edilemez.
 */
@Service
public class ReportEngineService {

    @PersistenceContext
    private EntityManager entityManager;

    // Yeni bir raporlanabilir tablo eklemek istediğinizde SADECE bu
    // haritaya ve ReportSchemaRegistry'ye ekleme yapmanız yeterli.
    private static final Map<String, Class<?>> RESOURCE_ENTITY_MAP = Map.of(
            "orders", Order.class,
            "customers", Customer.class,
            "products", Product.class,
            "campaigns", Campaign.class,
            "visits", Visit.class,
            "payments", Payment.class
    );

    @SuppressWarnings({"unchecked", "rawtypes"})
    public ReportResultDto runReport(ReportRequestDto request) {
        Class<?> entityClass = RESOURCE_ENTITY_MAP.get(request.getResource());
        if (entityClass == null) {
            throw new IllegalArgumentException("Bilinmeyen kaynak: " + request.getResource());
        }

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Tuple> query = cb.createTupleQuery();
        Root root = query.from(entityClass);

        List<Selection<?>> selections = new ArrayList<>();
        List<String> columns = new ArrayList<>();

        Path<?> groupPath = null;
        if (request.getGroupByField() != null && !request.getGroupByField().isBlank()) {
            groupPath = resolvePath(root, request.getGroupByField());
            selections.add(groupPath.alias("group"));
            columns.add("group");
        }

        if (request.getAggregations() != null) {
            for (AggregationDto agg : request.getAggregations()) {
                Path<?> aggPath = resolvePath(root, agg.getField());
                String alias = (agg.getAlias() != null && !agg.getAlias().isBlank())
                        ? agg.getAlias()
                        : agg.getFunction().toLowerCase() + "_" + agg.getField().replace(".", "_");

                Expression<?> expr = switch (agg.getFunction().toUpperCase()) {
                    case "SUM" -> cb.sum((Expression<Number>) aggPath);
                    case "COUNT" -> cb.count(aggPath);
                    case "AVG" -> cb.avg((Expression<Number>) aggPath);
                    case "MIN" -> cb.min((Expression<Number>) aggPath);
                    case "MAX" -> cb.max((Expression<Number>) aggPath);
                    default -> throw new IllegalArgumentException("Bilinmeyen fonksiyon: " + agg.getFunction());
                };
                selections.add(expr.alias(alias));
                columns.add(alias);
            }
        }

        query.multiselect(selections);

        if (request.getFilters() != null && !request.getFilters().isEmpty()) {
            List<Predicate> predicates = new ArrayList<>();
            for (FilterDto f : request.getFilters()) {
                predicates.add(buildPredicate(cb, root, f));
            }
            query.where(cb.and(predicates.toArray(new Predicate[0])));
        }

        if (groupPath != null) {
            query.groupBy(groupPath);
        }

        List<Tuple> results = entityManager.createQuery(query).getResultList();

        List<Map<String, Object>> rows = new ArrayList<>();
        for (Tuple t : results) {
            Map<String, Object> row = new LinkedHashMap<>();
            for (String col : columns) {
                row.put(col, t.get(col));
            }
            rows.add(row);
        }

        return new ReportResultDto(columns, rows);
    }

    private Path<?> resolvePath(Path<?> root, String field) {
        Path<?> path = root;
        for (String part : field.split("\\.")) {
            path = path.get(part); // gerçek entity alanı yoksa burada hata fırlatır
        }
        return path;
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private Predicate buildPredicate(CriteriaBuilder cb, Root root, FilterDto f) {
        Path path = resolvePath(root, f.getField());
        List<String> v = f.getValue();

        return switch (f.getOperator().toUpperCase()) {
            case "EQUALS" -> cb.equal(path, castValue(path, v.get(0)));
            case "GT" -> cb.greaterThan(path, (Comparable) castValue(path, v.get(0)));
            case "LT" -> cb.lessThan(path, (Comparable) castValue(path, v.get(0)));
            case "GTE" -> cb.greaterThanOrEqualTo(path, (Comparable) castValue(path, v.get(0)));
            case "LTE" -> cb.lessThanOrEqualTo(path, (Comparable) castValue(path, v.get(0)));
            case "BETWEEN" -> cb.between(path,
                    (Comparable) castValue(path, v.get(0)),
                    (Comparable) castValue(path, v.get(1)));
            case "LIKE" -> cb.like(path, "%" + v.get(0) + "%");
            case "IN" -> path.in(v);
            default -> throw new IllegalArgumentException("Bilinmeyen operatör: " + f.getOperator());
        };
    }

    private Object castValue(Path<?> path, String raw) {
        Class<?> type = path.getJavaType();
        if (type.equals(LocalDateTime.class)) return LocalDateTime.parse(raw);
        if (type.equals(LocalDate.class)) return LocalDate.parse(raw);
        if (type.equals(BigDecimal.class)) return new BigDecimal(raw);
        if (type.equals(Integer.class) || type.equals(int.class)) return Integer.parseInt(raw);
        if (type.equals(Long.class) || type.equals(long.class)) return Long.parseLong(raw);
        if (type.equals(Double.class) || type.equals(double.class)) return Double.parseDouble(raw);
        return raw;
    }
}