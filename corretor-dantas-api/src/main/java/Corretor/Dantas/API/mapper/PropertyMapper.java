package Corretor.Dantas.API.mapper;

import Corretor.Dantas.API.dto.PropertyImageResponse;
import Corretor.Dantas.API.dto.PropertyResponse;
import Corretor.Dantas.API.entity.Property;

public final class PropertyMapper {

    private PropertyMapper() {
    }

    public static PropertyResponse toResponse(Property property) {

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
                property.getUpdatedAt(),
                property.getImages().stream()
                        .map(PropertyImageResponse::from)
                        .toList()
        );
    }
}