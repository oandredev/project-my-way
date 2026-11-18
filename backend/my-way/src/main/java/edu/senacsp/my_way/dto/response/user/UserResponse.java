package edu.senacsp.my_way.dto.response.user;

import java.time.Instant;

public record UserResponse(
        Long id,
        String email,
        String name,
        Boolean active,
        Instant modifiedAt,
        Instant createdAt
) {}
