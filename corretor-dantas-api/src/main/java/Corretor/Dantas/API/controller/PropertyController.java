package Corretor.Dantas.API.controller;

import Corretor.Dantas.API.dto.PageResponse;
import Corretor.Dantas.API.dto.PropertyRequest;
import Corretor.Dantas.API.dto.PropertyResponse;
import Corretor.Dantas.API.entity.Property;
import Corretor.Dantas.API.entity.PropertyType;
import Corretor.Dantas.API.entity.TransactionType;
import Corretor.Dantas.API.exception.InvalidPaginationException;
import Corretor.Dantas.API.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @PostMapping
    public ResponseEntity<PropertyResponse> create(
            @Valid @RequestBody PropertyRequest request
    ) {

        Property property = propertyService.create(request);

        PropertyResponse response = toResponse(property);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<PageResponse<PropertyResponse>> findAll(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String neighborhood,
            @RequestParam(required = false) PropertyType type,
            @RequestParam(required = false) TransactionType transactionType,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @PageableDefault(
                    size = 10,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            ) Pageable pageable
    ) {

        if (pageable.getPageNumber() < 0) {
            throw new InvalidPaginationException(
                    "O número da página não pode ser negativo"
            );
        }

        if (pageable.getPageSize() <= 0) {
            throw new InvalidPaginationException(
                    "O tamanho da página deve ser maior que zero"
            );
        }

        if (pageable.getPageSize() > 50) {
            throw new InvalidPaginationException(
                    "O tamanho máximo da página é 50"
            );
        }

        Page<PropertyResponse> properties =
                propertyService.findAll(
                                city,
                                neighborhood,
                                type,
                                transactionType,
                                minPrice,
                                maxPrice,
                                pageable
                        )
                        .map(this::toResponse);

        PageResponse<PropertyResponse> response =
                PageResponse.from(properties);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> findById(
            @PathVariable Long id
    ) {

        Property property = propertyService.findById(id);

        return ResponseEntity.ok(toResponse(property));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody PropertyRequest request
    ) {

        Property property =
                propertyService.update(id, request);

        return ResponseEntity.ok(toResponse(property));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        propertyService.delete(id);

        return ResponseEntity.noContent().build();
    }

    private PropertyResponse toResponse(Property property) {

        return new PropertyResponse(
                property.getId(),
                property.getTitle(),
                property.getDescription(),
                property.getPrice(),
                property.getType(),
                property.getTransactionType(),
                property.getBedrooms(),
                property.getBathrooms(),
                property.getArea(),
                property.getCity(),
                property.getNeighborhood(),
                property.getAddress(),
                property.getStatus(),
                property.getCreatedAt(),
                property.getUpdatedAt()
        );
    }
}