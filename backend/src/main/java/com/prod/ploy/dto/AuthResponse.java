package com.prod.ploy.dto;

public record AuthResponse(
        String token,
        UserView user
) {
    public record UserView(
            Long id,
            String name,
            String email,
            String role
    ) {}
}
