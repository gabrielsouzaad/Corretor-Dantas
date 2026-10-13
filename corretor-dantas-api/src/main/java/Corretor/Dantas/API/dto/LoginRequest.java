package Corretor.Dantas.API.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(

        @NotBlank(message = "E-mail é obrigatório")
        @Email(message = "E-mail inválido")
        @Size(max = 254, message = "E-mail muito longo")
        String email,

        @NotBlank(message = "Senha é obrigatória")
        @Size(max = 100, message = "Senha muito longa")
        String password

) {
}