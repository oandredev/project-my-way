package edu.senacsp.my_way.dto.request.user;

public record LoginRequest (
        String email,
        String password,
        Boolean remember
) {}
