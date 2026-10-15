package Corretor.Dantas.API.specification;

import Corretor.Dantas.API.entity.Property;
import Corretor.Dantas.API.entity.PropertyStatus;
import Corretor.Dantas.API.entity.PropertyType;
import Corretor.Dantas.API.entity.TransactionType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.Locale;

public final class PropertySpecification {

    private PropertySpecification() {
    }

    public static Specification<Property> statusNotInactive() {
        return (root, query, cb) ->
                cb.notEqual(root.get("status"), PropertyStatus.INACTIVE);
    }

    public static Specification<Property> statusEquals(PropertyStatus status) {
        return (root, query, cb) ->
                cb.equal(root.get("status"), status);
    }

    public static Specification<Property> cityContains(String city) {
        return containsIgnoreCase("city", city);
    }

    public static Specification<Property> neighborhoodContains(String neighborhood) {
        return containsIgnoreCase("neighborhood", neighborhood);
    }

    public static Specification<Property> typeEquals(PropertyType type) {
        return (root, query, cb) ->
                cb.equal(root.get("type"), type);
    }

    public static Specification<Property> transactionTypeEquals(
            TransactionType transactionType) {
        return (root, query, cb) ->
                cb.equal(root.get("transactionType"), transactionType);
    }

    public static Specification<Property> priceGreaterThanOrEqual(BigDecimal min) {
        return (root, query, cb) ->
                cb.greaterThanOrEqualTo(root.<BigDecimal>get("price"), min);
    }

    public static Specification<Property> priceLessThanOrEqual(BigDecimal max) {
        return (root, query, cb) ->
                cb.lessThanOrEqualTo(root.<BigDecimal>get("price"), max);
    }

    private static Specification<Property> containsIgnoreCase(
            String field, String value) {

        String pattern =
                "%" + escapeLike(value.trim().toLowerCase(Locale.ROOT)) + "%";

        return (root, query, cb) ->
                cb.like(cb.lower(root.<String>get(field)), pattern, '\\');
    }

    // Evita que "%" e "_" digitados pelo usuário virem curingas do LIKE.
    private static String escapeLike(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
    }
}