package Corretor.Dantas.API.service;

import Corretor.Dantas.API.dto.PropertyRequest;
import Corretor.Dantas.API.entity.Property;
import Corretor.Dantas.API.entity.PropertyStatus;
import Corretor.Dantas.API.entity.PropertyType;
import Corretor.Dantas.API.entity.TransactionType;
import Corretor.Dantas.API.exception.ResourceNotFoundException;
import Corretor.Dantas.API.repository.PropertyRepository;
import Corretor.Dantas.API.specification.PropertySpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public Property create(PropertyRequest request) {

        Property property = Property.builder()
                .title(request.title())
                .description(request.description())
                .price(request.price())
                .type(request.type())
                .transactionType(request.transactionType())
                .bedrooms(request.bedrooms())
                .bathrooms(request.bathrooms())
                .area(request.area())
                .city(request.city())
                .neighborhood(request.neighborhood())
                .address(request.address())
                .build();

        return propertyRepository.save(property);
    }

    public Page<Property> findAll(
            String city,
            String neighborhood,
            PropertyType type,
            TransactionType transactionType,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {

        Specification<Property> specification =
                PropertySpecification.statusNotInactive();

        if (city != null && !city.isBlank()) {
            specification = specification.and(
                    PropertySpecification.cityEquals(city)
            );
        }

        if (neighborhood != null && !neighborhood.isBlank()) {
            specification = specification.and(
                    PropertySpecification.neighborhoodEquals(neighborhood)
            );
        }

        if (type != null) {
            specification = specification.and(
                    PropertySpecification.typeEquals(type)
            );
        }

        if (transactionType != null) {
            specification = specification.and(
                    PropertySpecification.transactionTypeEquals(transactionType)
            );
        }

        if (minPrice != null) {
            specification = specification.and(
                    PropertySpecification.priceGreaterThanOrEqual(minPrice)
            );
        }

        if (maxPrice != null) {
            specification = specification.and(
                    PropertySpecification.priceLessThanOrEqual(maxPrice)
            );
        }

        return propertyRepository.findAll(specification, pageable);
    }

    public Property findById(Long id) {

        return propertyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Imóvel não encontrado"
                        )
                );
    }

    public Property update(Long id, PropertyRequest request) {

        Property property = findById(id);

        property.setTitle(request.title());
        property.setDescription(request.description());
        property.setPrice(request.price());
        property.setType(request.type());
        property.setTransactionType(request.transactionType());
        property.setBedrooms(request.bedrooms());
        property.setBathrooms(request.bathrooms());
        property.setArea(request.area());
        property.setCity(request.city());
        property.setNeighborhood(request.neighborhood());
        property.setAddress(request.address());

        return propertyRepository.save(property);
    }

    public void delete(Long id) {

        Property property = findById(id);

        property.setStatus(PropertyStatus.INACTIVE);

        propertyRepository.save(property);
    }
}