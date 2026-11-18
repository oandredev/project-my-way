package edu.senacsp.my_way.repository;

import edu.senacsp.my_way.entity.StudyItem;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudyItemRepository extends JpaRepository<StudyItem, Long> {

    List<StudyItem> findAllByUserIdAndActiveTrue(Long userId);

    Optional<StudyItem> findByIdAndUserId(Long id, Long userId);
}
