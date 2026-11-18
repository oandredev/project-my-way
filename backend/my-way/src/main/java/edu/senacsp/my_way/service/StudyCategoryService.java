package edu.senacsp.my_way.service;

import edu.senacsp.my_way.dto.request.studyCategory.StudyCategoryCreateRequest;
import edu.senacsp.my_way.dto.request.studyCategory.StudyCategoryUpdateRequest;
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

    /**
     * Lists the active study categories of the authenticated user.
     *
     * <p>Only categories owned by the authenticated user are returned, so categories from
     * other users are never exposed. Categories deactivated through the soft delete
     * ({@code active = false}) are not included in the list.
     *
     * <p>If the user has no active categories, an empty list is returned.
     *
     * @param user the authenticated user, resolved from the JWT
     * @return a list of {@link StudyCategoryResponse} with the data of each active category of the user
     * @throws ResponseStatusException if the authenticated user no longer exists (CODE 401)
     */
    @Transactional(readOnly = true)
    public List<StudyCategoryResponse> findAllByUser(User user) {
        // Validation
        User userDB = userRepo.findById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        // Get and Return
        return repo.findAllByUserIdAndActiveTrue(userDB.getId())
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

    /**
     * Updates a study category of the authenticated user.
     *
     * <p>All fields are required and validated like in {@link #create}. The name has its extra
     * spaces collapsed and must be unique among the categories of the same user
     * (case-insensitive), ignoring the category being updated itself.
     *
     * <p>{@code active} works as a soft delete: sending {@code false} deactivates the category
     * without removing it from the database, and sending {@code true} reactivates it.
     *
     * <p>The category is always searched among the ones owned by the authenticated user, so a
     * category from another user is treated as not found.
     *
     * @param user the authenticated user, resolved from the JWT
     * @param id   the id of the category to update, taken from the URL
     * @param req  the category name, color and active flag
     * @return a {@link StudyCategoryResponse} with the updated category's data
     * @throws ResponseStatusException if id, name, color or active is missing or invalid (CODE 400),
     *                                 the authenticated user no longer exists (CODE 401),
     *                                 the category does not exist for this user (CODE 404),
     *                                 or the user already has another category with this name (CODE 409)
     */
    @Transactional
    public StudyCategoryResponse update(User user, Long id, StudyCategoryUpdateRequest req) {
        // Validations
        if (id == null || id <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id is required and must be positive");
        }

        String name = validateName(req.name());
        Integer colorId = validateColorId(req.colorId());

        if (req.active() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Active is required");
        }

        User userDB = userRepo.findById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        StudyCategory category = repo.findByIdAndUserId(id, userDB.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        if (repo.existsByUserIdAndNameIgnoreCaseAndIdNot(userDB.getId(), name, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category name already in use by this user");
        }

        // Sets
        category.setName(name);
        category.setColorId(colorId);
        category.setActive(req.active());

        category = repo.save(category);

        return new StudyCategoryResponse(category.getId(), category.getName(), category.getColorId(),
                category.getModifiedAt(), category.getCreatedAt());
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
