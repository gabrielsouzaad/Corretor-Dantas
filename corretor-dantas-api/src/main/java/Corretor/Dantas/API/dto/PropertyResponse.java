package Corretor.Dantas.API.dto;

import Corretor.Dantas.API.entity.PropertyStatus;
import Corretor.Dantas.API.entity.PropertyType;
import Corretor.Dantas.API.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PropertyResponse(

        Long id,

        String title,

        String description,

        BigDecimal price,

        PropertyType type,

        TransactionType transactionType,

        Integer bedrooms,

        Integer bathrooms,

        BigDecimal area,

        String city,

        String neighborhood,

        String address,

        PropertyStatus status,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
) {
}