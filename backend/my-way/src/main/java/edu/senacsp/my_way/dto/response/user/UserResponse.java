package edu.senacsp.my_way.dto.response.user;

// import edu.senacsp.my_way.dto.response.studyItem.StudyItemResponse;

import java.time.Instant;
import java.util.List;

public record UserResponse(
        Long id,
        String email,
        String name,
        // List<StudyItemResponse> studyItemList,
        Boolean active,
        Instant modifiedAt,
        Instant createdAt
) {}
