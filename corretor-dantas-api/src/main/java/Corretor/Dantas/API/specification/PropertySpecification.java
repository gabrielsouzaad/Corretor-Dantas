package Corretor.Dantas.API.specification;

import Corretor.Dantas.API.entity.Property;
import Corretor.Dantas.API.entity.PropertyStatus;
import Corretor.Dantas.API.entity.PropertyType;
import Corretor.Dantas.API.entity.TransactionType;
import org.springframework.data.jpa.domain.Specification;

public class PropertySpecification {

    public static Specification<Property> cityEquals(String city) {

        return (root, query, criteriaBuilder) ->
                city == null || city.isBlank()
                        ? null
                        : criteriaBuilder.equal(
                        criteriaBuilder.lower(root.get("city")),
                        city.toLowerCase()
                );
    }

    public static Specification<Property> neighborhoodEquals(
            String neighborhood) {

        return (root, query, criteriaBuilder) ->
                neighborhood == null || neighborhood.isBlank()
                        ? null
                        : criteriaBuilder.equal(
                        criteriaBuilder.lower(root.get("neighborhood")),
                        neighborhood.toLowerCase()
                );
    }

    public static Specification<Property> typeEquals(
            PropertyType type) {

        return (root, query, criteriaBuilder) ->
                type == null
                        ? null
                        : criteriaBuilder.equal(
                        root.get("type"),
                        type
                );
    }

    public static Specification<Property> transactionTypeEquals(
            TransactionType transactionType) {

        return (root, query, criteriaBuilder) ->
                transactionType == null
                        ? null
                        : criteriaBuilder.equal(
                        root.get("transactionType"),
                        transactionType
                );
    }

    public static Specification<Property> statusNotInactive() {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.notEqual(
                        root.get("status"),
                        PropertyStatus.INACTIVE
                );
    }

    public static Specification<Property> priceGreaterThanOrEqual(
            java.math.BigDecimal minPrice) {

        return (root, query, criteriaBuilder) ->
                minPrice == null
                        ? null
                        : criteriaBuilder.greaterThanOrEqualTo(
                        root.get("price"),
                        minPrice
                );
    }

    public static Specification<Property> priceLessThanOrEqual(
            java.math.BigDecimal maxPrice) {

        return (root, query, criteriaBuilder) ->
                maxPrice == null
                        ? null
                        : criteriaBuilder.lessThanOrEqualTo(
                        root.get("price"),
                        maxPrice
                );
    }

}