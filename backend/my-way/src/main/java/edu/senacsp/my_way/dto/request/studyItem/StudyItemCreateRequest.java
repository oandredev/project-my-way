package edu.senacsp.my_way.dto.request.studyItem;

import edu.senacsp.my_way.entity.enums.StudyPriority;

import java.time.Instant;

public record StudyItemCreateRequest(
        Long categoryId,        // Optional
        String title,
        String institution,
        String link,            // Optional
        StudyPriority priority,
        Instant deadline,       // Optional
        String notes,           // Optional
        Double totalHours
) { }