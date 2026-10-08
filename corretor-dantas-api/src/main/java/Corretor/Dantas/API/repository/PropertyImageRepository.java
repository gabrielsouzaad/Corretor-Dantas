package Corretor.Dantas.API.repository;

import Corretor.Dantas.API.entity.PropertyImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PropertyImageRepository extends JpaRepository<PropertyImage, Long> {

    List<PropertyImage> findByPropertyIdOrderByCoverDescIdAsc(Long propertyId);

    Optional<PropertyImage> findByIdAndPropertyId(Long id, Long propertyId);

    long countByPropertyId(Long propertyId);

    boolean existsByPropertyIdAndCoverTrue(Long propertyId);
}