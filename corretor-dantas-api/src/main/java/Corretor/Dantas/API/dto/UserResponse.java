package Corretor.Dantas.API.dto;

import Corretor.Dantas.API.entity.Role;

public record UserResponse(
        Long id,
        String name,
        String email,
        Role role
) {
}