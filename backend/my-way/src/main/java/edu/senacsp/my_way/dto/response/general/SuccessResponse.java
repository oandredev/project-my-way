package edu.senacsp.my_way.dto.response.general;

public record SuccessResponse<T>(
        T data,
        String message
) {}
