package edu.senacsp.my_way.dto.request.user;

public record UpdateUserRequest(
        String name,
        String email,
        String currentPassword
) {}
