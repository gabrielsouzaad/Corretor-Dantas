package Corretor.Dantas.API.dto;

import Corretor.Dantas.API.entity.PropertyType;
import Corretor.Dantas.API.entity.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
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
        @Digits(integer = 13, fraction = 2, message = "Preço inválido (até 13 dígitos e 2 casas decimais)")
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
        @Digits(integer = 8, fraction = 2, message = "Área inválida (até 8 dígitos e 2 casas decimais)")
        BigDecimal area,

        @NotBlank(message = "Cidade é obrigatória")
        @Size(max = 100, message = "Cidade deve ter no máximo 100 caracteres")
        String city,

        @NotBlank(message = "Bairro é obrigatório")
        @Size(max = 100, message = "Bairro deve ter no máximo 100 caracteres")
        String neighborhood,

        @NotBlank(message = "Endereço é obrigatório")
        @Size(max = 255, message = "Endereço deve ter no máximo 255 caracteres")
        String address
) {
}