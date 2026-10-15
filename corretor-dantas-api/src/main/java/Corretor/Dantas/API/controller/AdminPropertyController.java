package Corretor.Dantas.API.controller;

import Corretor.Dantas.API.dto.PageResponse;
import Corretor.Dantas.API.dto.PropertyResponse;
import Corretor.Dantas.API.entity.PropertyStatus;
import Corretor.Dantas.API.mapper.PropertyMapper;
import Corretor.Dantas.API.service.PropertyService;
import Corretor.Dantas.API.util.PaginationRules;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/properties")
public class AdminPropertyController {

    private final PropertyService propertyService;

    public AdminPropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<PropertyResponse>> findAll(
            @RequestParam(required = false) PropertyStatus status,
            @PageableDefault(
                    size = 10,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            ) Pageable pageable
    ) {

        PaginationRules.validate(pageable);

        Page<PropertyResponse> properties =
                propertyService.findAllForAdmin(status, pageable)
                        .map(PropertyMapper::toResponse);

        return ResponseEntity.ok(PageResponse.from(properties));
    }
}