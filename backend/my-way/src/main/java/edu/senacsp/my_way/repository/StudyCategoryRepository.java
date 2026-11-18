package edu.senacsp.my_way.repository;

import edu.senacsp.my_way.entity.StudyCategory;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudyCategoryRepository extends JpaRepository<StudyCategory, Long> {

    List<StudyCategory> findAllByUserIdAndActiveTrue(Long userId);

    Optional<StudyCategory> findByIdAndUserId(Long id, Long userId);

    boolean existsByUserIdAndNameIgnoreCase(Long userId, String name);

    boolean existsByUserIdAndNameIgnoreCaseAndIdNot(Long userId, String name, Long id);
}
