package Corretor.Dantas.API.controller;

import Corretor.Dantas.API.dto.PageResponse;
import Corretor.Dantas.API.dto.PropertyRequest;
import Corretor.Dantas.API.dto.PropertyResponse;
import Corretor.Dantas.API.dto.PropertyStatusRequest;
import Corretor.Dantas.API.entity.PropertyType;
import Corretor.Dantas.API.entity.TransactionType;
import Corretor.Dantas.API.mapper.PropertyMapper;
import Corretor.Dantas.API.service.PropertyService;
import Corretor.Dantas.API.util.PaginationRules;
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

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(PropertyMapper.toResponse(
                        propertyService.create(request)
                ));
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

        PaginationRules.validate(pageable);

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
                        .map(PropertyMapper::toResponse);

        return ResponseEntity.ok(PageResponse.from(properties));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> findById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                PropertyMapper.toResponse(propertyService.findPublicById(id))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody PropertyRequest request
    ) {

        return ResponseEntity.ok(
                PropertyMapper.toResponse(propertyService.update(id, request))
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<PropertyResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody PropertyStatusRequest request
    ) {

        return ResponseEntity.ok(
                PropertyMapper.toResponse(
                        propertyService.updateStatus(id, request.status())
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        propertyService.delete(id);

        return ResponseEntity.noContent().build();
    }
}