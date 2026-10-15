package Corretor.Dantas.API.dto;

import Corretor.Dantas.API.entity.PropertyStatus;
import jakarta.validation.constraints.NotNull;

public record PropertyStatusRequest(

        @NotNull(message = "Status é obrigatório")
        PropertyStatus status
) {
}