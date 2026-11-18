package edu.senacsp.my_way.dto.request.user;

public record UpdatePasswordRequest(
        String currentPassword,
        String newPassword
) {}
