package Corretor.Dantas.API.dto;

import Corretor.Dantas.API.entity.PropertyType;
import Corretor.Dantas.API.entity.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record PropertyRequest(

        @NotBlank(message = "Título é obrigatório")
        @Size(max = 150, message = "Título deve ter no máximo 150 caracteres")
        String title,

        @NotBlank(message = "Descrição é obrigatória")
        @Size(max = 2000, message = "Descrição deve ter no máximo 2000 caracteres")
        String description,

        @NotNull(message = "Preço é obrigatório")
        @DecimalMin(value = "0.01", message = "Preço deve ser maior que zero")
        BigDecimal price,

        @NotNull(message = "Tipo do imóvel é obrigatório")
        PropertyType type,

        @NotNull(message = "Tipo de transação é obrigatório")
        TransactionType transactionType,

        @NotNull(message = "Quantidade de quartos é obrigatória")
        @Min(value = 0, message = "Quantidade de quartos não pode ser negativa")
        Integer bedrooms,

        @NotNull(message = "Quantidade de banheiros é obrigatória")
        @Min(value = 0, message = "Quantidade de banheiros não pode ser negativa")
        Integer bathrooms,

        @NotNull(message = "Área é obrigatória")
        @DecimalMin(value = "0.01", message = "Área deve ser maior que zero")
        BigDecimal area,

        @NotBlank(message = "Cidade é obrigatória")
        String city,

        @NotBlank(message = "Bairro é obrigatório")
        String neighborhood,

        @NotBlank(message = "Endereço é obrigatório")
        String address
) {
}