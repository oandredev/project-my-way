package edu.senacsp.my_way.dto.request.studyCategory;

public record StudyCategoryUpdateRequest(
        String name,
        Integer colorId,
        Boolean active
) { }
