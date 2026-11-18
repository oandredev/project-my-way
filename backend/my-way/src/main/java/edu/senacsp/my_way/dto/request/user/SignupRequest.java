package edu.senacsp.my_way.dto.request.user;

public record SignupRequest(
        String email,
        String password,
        String name
) {}
