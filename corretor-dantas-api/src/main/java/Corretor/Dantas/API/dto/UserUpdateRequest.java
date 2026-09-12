package Corretor.Dantas.API.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(

        @Size(min = 2, max = 100,
                message = "Nome deve ter entre 2 e 100 caracteres")
        String name,

        @Email(message = "E-mail inválido")
        String email,

        @Size(min = 8, max = 100,
                message = "Senha deve ter entre 8 e 100 caracteres")
        String password
) {
}