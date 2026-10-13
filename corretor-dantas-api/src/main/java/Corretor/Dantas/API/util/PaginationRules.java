package Corretor.Dantas.API.util;

import Corretor.Dantas.API.exception.InvalidPaginationException;
import org.springframework.data.domain.Pageable;

import java.util.Set;
import java.util.TreeSet;

public final class PaginationRules {

    public static final int MAX_PAGE_SIZE = 50;

    private static final Set<String> ALLOWED_SORTS = Set.of(
            "id", "createdAt", "updatedAt", "price", "area",
            "bedrooms", "bathrooms", "title", "city", "neighborhood"
    );

    private PaginationRules() {
    }

    public static void validate(Pageable pageable) {

        if (pageable.getPageSize() > MAX_PAGE_SIZE) {
            throw new InvalidPaginationException(
                    "O tamanho máximo da página é " + MAX_PAGE_SIZE
            );
        }

        pageable.getSort().forEach(order -> {
            if (!ALLOWED_SORTS.contains(order.getProperty())) {
                throw new InvalidPaginationException(
                        "Ordenação inválida. Campos permitidos: "
                                + String.join(", ", new TreeSet<>(ALLOWED_SORTS))
                );
            }
        });
    }
}