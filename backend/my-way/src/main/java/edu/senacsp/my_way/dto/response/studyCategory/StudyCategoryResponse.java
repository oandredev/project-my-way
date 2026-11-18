package edu.senacsp.my_way.dto.response.studyCategory;

import java.time.Instant;

public record StudyCategoryResponse(
        Long id,
        String name,
        Integer colorId,
        Instant modifiedAt,
        Instant createdAt
) { }
