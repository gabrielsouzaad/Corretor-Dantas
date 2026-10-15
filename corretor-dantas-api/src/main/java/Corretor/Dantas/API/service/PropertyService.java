package Corretor.Dantas.API.service;

import Corretor.Dantas.API.dto.PropertyRequest;
import Corretor.Dantas.API.entity.Property;
import Corretor.Dantas.API.entity.PropertyStatus;
import Corretor.Dantas.API.entity.PropertyType;
import Corretor.Dantas.API.entity.TransactionType;
import Corretor.Dantas.API.exception.BusinessRuleException;
import Corretor.Dantas.API.exception.ResourceNotFoundException;
import Corretor.Dantas.API.repository.PropertyRepository;
import Corretor.Dantas.API.specification.PropertySpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

        if (minPrice != null && maxPrice != null
                && minPrice.compareTo(maxPrice) > 0) {
            throw new BusinessRuleException(
                    "O preço mínimo não pode ser maior que o máximo"
            );
        }

        Specification<Property> specification =
                PropertySpecification.statusNotInactive();

        if (city != null && !city.isBlank()) {
            specification = specification.and(
                    PropertySpecification.cityContains(city)
            );
        }

        if (neighborhood != null && !neighborhood.isBlank()) {
            specification = specification.and(
                    PropertySpecification.neighborhoodContains(neighborhood)
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

        return propertyRepository.findAll(specification, stable(pageable));
    }

    public Page<Property> findAllForAdmin(
            PropertyStatus status,
            Pageable pageable
    ) {

        Specification<Property> specification = status == null
                ? (root, query, cb) -> cb.conjunction()
                : PropertySpecification.statusEquals(status);

        return propertyRepository.findAll(specification, stable(pageable));
    }

    public Property findById(Long id) {

        return propertyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Imóvel não encontrado"
                        )
                );
    }


    public Property findPublicById(Long id) {

        Property property = findById(id);

        if (property.getStatus() == PropertyStatus.INACTIVE) {
            throw new ResourceNotFoundException("Imóvel não encontrado");
        }

        return property;
    }

    public Property update(Long id, PropertyRequest request) {

        Property property = findById(id);

        boolean inconsistent =
                (property.getStatus() == PropertyStatus.SOLD
                        && request.transactionType() != TransactionType.SALE)
                        || (property.getStatus() == PropertyStatus.RENTED
                        && request.transactionType() != TransactionType.RENT);

        if (inconsistent) {
            throw new BusinessRuleException(
                    "Volte o imóvel para Disponível antes de alterar o tipo de negociação"
            );
        }

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

    public Property updateStatus(Long id, PropertyStatus newStatus) {

        Property property = findById(id);

        if (newStatus == PropertyStatus.SOLD
                && property.getTransactionType() != TransactionType.SALE) {
            throw new BusinessRuleException(
                    "Somente imóveis à venda podem ser marcados como vendidos"
            );
        }

        if (newStatus == PropertyStatus.RENTED
                && property.getTransactionType() != TransactionType.RENT) {
            throw new BusinessRuleException(
                    "Somente imóveis para aluguel podem ser marcados como alugados"
            );
        }

        property.setStatus(newStatus);

        return propertyRepository.save(property);
    }

    public void delete(Long id) {

        Property property = findById(id);

        property.setStatus(PropertyStatus.INACTIVE);

        propertyRepository.save(property);
    }

    private Pageable stable(Pageable pageable) {

        Sort sort = pageable.getSort()
                .and(Sort.by(Sort.Direction.DESC, "id"));

        return PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort
        );
    }
}