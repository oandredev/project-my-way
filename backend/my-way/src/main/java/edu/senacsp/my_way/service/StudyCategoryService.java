package edu.senacsp.my_way.service;

import edu.senacsp.my_way.dto.request.studyCategory.StudyCategoryCreateRequest;
import edu.senacsp.my_way.dto.response.studyCategory.StudyCategoryResponse;

import edu.senacsp.my_way.entity.StudyCategory;
import edu.senacsp.my_way.entity.User;

import edu.senacsp.my_way.repository.StudyCategoryRepository;
import edu.senacsp.my_way.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class StudyCategoryService {
    private final StudyCategoryRepository repo;
    private final UserRepository userRepo;

    private static final int NAME_MIN = 1;
    private static final int NAME_MAX = 255;
    private static final int COLOR_MIN = 1;
    private static final int COLOR_MAX = 10;

    public StudyCategoryService(StudyCategoryRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    /**
     * Creates a study category for the authenticated user.
     *
     * <p>The name has its extra spaces collapsed and must be unique among the categories
     * of the same user (case-insensitive). Different users can have categories with the
     * same name. {@code colorId} must be one of the colors of the fixed palette (1 to 10).
     *
     * <p>The owner is the user identified by the JWT, never one taken from the request body.
     *
     * @param user the authenticated user, resolved from the JWT
     * @param req  the category name and color
     * @return a {@link StudyCategoryResponse} with the created category's data
     * @throws ResponseStatusException if name or color is missing or invalid (CODE 400),
     *                                 the authenticated user no longer exists (CODE 401),
     *                                 or the user already has a category with this name (CODE 409)
     */
    @Transactional
    public StudyCategoryResponse create(User user, StudyCategoryCreateRequest req) {
        // Validations
        String name = validateName(req.name());
        Integer colorId = validateColorId(req.colorId());

        User userDB = userRepo.findById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (repo.existsByUserIdAndNameIgnoreCase(userDB.getId(), name)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category name already in use by this user");
        }

        // Sets
        StudyCategory category = new StudyCategory(userDB, name, colorId);

        category = repo.save(category);

        return new StudyCategoryResponse(category.getId(), category.getName(), category.getColorId(),
                category.getModifiedAt(), category.getCreatedAt());
    }

    public List<StudyCategoryResponse> findAllByUser(User user)
    {
        // Validation
        User userDB = userRepo.findById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        // Get and Return
        return repo.findAllByUserId(user.getId())
                .stream()
                .map(category -> new StudyCategoryResponse(
                        category.getId(),
                        category.getName(),
                        category.getColorId(),
                        category.getModifiedAt(),
                        category.getCreatedAt()
                ))
                .toList();
    }

    //-------------------------------------------------------------------------------------------------------------

    // VALIDATIONS
    private String validateName(String name) {
        if (name == null || name.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }

        String n = name.trim().replaceAll("\\s+", " ");

        if (n.length() < NAME_MIN || n.length() > NAME_MAX) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name must have between " + NAME_MIN + " and " + NAME_MAX + " characters");
        }

        return n;
    }

    private Integer validateColorId(Integer colorId) {
        if (colorId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Color is required");
        }

        if (colorId < COLOR_MIN || colorId > COLOR_MAX) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Color must be between " + COLOR_MIN + " and " + COLOR_MAX);
        }

        return colorId;
    }
}
