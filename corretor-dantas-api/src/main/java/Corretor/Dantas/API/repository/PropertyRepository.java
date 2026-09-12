package Corretor.Dantas.API.repository;

import Corretor.Dantas.API.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PropertyRepository
        extends JpaRepository<Property, Long>,
        JpaSpecificationExecutor<Property> {
}