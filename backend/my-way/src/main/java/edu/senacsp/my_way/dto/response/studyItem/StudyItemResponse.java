package edu.senacsp.my_way.dto.response.studyItem;

import edu.senacsp.my_way.entity.enums.StudyPriority;
import edu.senacsp.my_way.entity.enums.StudyStatus;

import java.time.Instant;

public record StudyItemResponse(
        Long id,
        Long categoryId,
        String title,
        String institution,
        String link,
        StudyPriority priority,
        Instant deadline,
        String notes,
        Double totalHours,
        Double doneHours,
        StudyStatus status,
        Instant completedAt,
        Instant modifiedAt,
        Instant createdAt
) { }