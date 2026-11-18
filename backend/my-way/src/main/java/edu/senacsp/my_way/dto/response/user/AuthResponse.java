package edu.senacsp.my_way.dto.response.user;

/* Used internally only by the service and controller layers; never sent to the client. */
public record AuthResponse(
        UserResponse userResponse,
        String token
) {}
