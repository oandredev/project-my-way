package edu.senacsp.my_way.repository;

import edu.senacsp.my_way.entity.StudyCategory;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyCategoryRepository extends JpaRepository<StudyCategory, Long> {

    boolean existsByUserIdAndNameIgnoreCase(Long userId, String name);
}