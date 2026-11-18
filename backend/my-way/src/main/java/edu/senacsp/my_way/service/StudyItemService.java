package edu.senacsp.my_way.service;

import edu.senacsp.my_way.dto.request.studyItem.StudyItemCreateRequest;
import edu.senacsp.my_way.dto.request.studyItem.StudyItemUpdateRequest;
import edu.senacsp.my_way.dto.response.studyItem.StudyItemResponse;

import edu.senacsp.my_way.entity.StudyCategory;
import edu.senacsp.my_way.entity.StudyItem;
import edu.senacsp.my_way.entity.User;
import edu.senacsp.my_way.entity.enums.StudyPriority;
import edu.senacsp.my_way.entity.enums.StudyStatus;

import edu.senacsp.my_way.repository.StudyCategoryRepository;
import edu.senacsp.my_way.repository.StudyItemRepository;
import edu.senacsp.my_way.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class StudyItemService {
    private final StudyItemRepository repo;
    private final StudyCategoryRepository categoryRepo;
    private final UserRepository userRepo;

    private static final int TITLE_MIN = 1;
    private static final int TITLE_MAX = 255;
    private static final int INSTITUTION_MIN = 1;
    private static final int INSTITUTION_MAX = 255;
    private static final int LINK_MAX = 2048;
    private static final int NOTES_MAX = 2000;

    public StudyItemService(StudyItemRepository repo, StudyCategoryRepository categoryRepo, UserRepository userRepo) {
        this.repo = repo;
        this.categoryRepo = categoryRepo;
        this.userRepo = userRepo;
    }

    /**
     * Creates a study item for the authenticated user.
     *
     * <p>Title and institution have their extra spaces collapsed. Link, deadline, notes and
     * category are optional; blank link and notes are stored as {@code null}. {@code totalHours}
     * must be greater than 0.
     *
     * <p>If {@code categoryId} is informed, the category must exist, belong to the authenticated
     * user and be active.
     *
     * <p>The item is created with {@code doneHours = 0}, status {@code TODO} and as active.
     * The owner is the user identified by the JWT, never one taken from the request body.
     *
     * @param user the authenticated user, resolved from the JWT
     * @param req  the study item data
     * @return a {@link StudyItemResponse} with the created item's data
     * @throws ResponseStatusException if a required field is missing or invalid (CODE 400),
     *                                 the authenticated user no longer exists (CODE 401),
     *                                 or the informed category does not exist for this user (CODE 404)
     */
    @Transactional
    public StudyItemResponse create(User user, StudyItemCreateRequest req) {
        // Validations
        String title = validateRequiredText(req.title(), "Title", TITLE_MIN, TITLE_MAX);
        String institution = validateRequiredText(req.institution(), "Institution", INSTITUTION_MIN, INSTITUTION_MAX);
        String link = validateOptionalText(req.link(), "Link", LINK_MAX);
        String notes = validateOptionalText(req.notes(), "Notes", NOTES_MAX);
        StudyPriority priority = validatePriority(req.priority());
        Double totalHours = validateTotalHours(req.totalHours());

        User userDB = userRepo.findById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        StudyCategory category = findCategory(req.categoryId(), userDB.getId());

        // Sets
        StudyItem item = new StudyItem(userDB, title, institution, priority, totalHours);
        item.setCategory(category);
        item.setLink(link);
        item.setDeadline(req.deadline());
        item.setNotes(notes);

        item = repo.save(item);

        return new StudyItemResponse(
                item.getId(),
                item.getCategory() != null ? item.getCategory().getId() : null,
                item.getTitle(),
                item.getInstitution(),
                item.getLink(),
                item.getPriority(),
                item.getDeadline(),
                item.getNotes(),
                item.getTotalHours(),
                item.getDoneHours(),
                item.getStatus(),
                item.getCompletedAt(),
                item.getModifiedAt(),
                item.getCreatedAt()
        );
    }

    /**
     * Lists the active study items of the authenticated user.
     *
     * <p>Only items owned by the authenticated user are returned. Items deactivated through
     * the soft delete ({@code active = false}) are not included in the list.
     *
     * <p>If the user has no active items, an empty list is returned.
     *
     * @param user the authenticated user, resolved from the JWT
     * @return a list of {@link StudyItemResponse} with the data of each active item of the user
     * @throws ResponseStatusException if the authenticated user no longer exists (CODE 401)
     */
    @Transactional(readOnly = true)
    public List<StudyItemResponse> findAllByUser(User user) {
        // Validation
        User userDB = userRepo.findById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        // Get and Return
        return repo.findAllByUserIdAndActiveTrue(userDB.getId())
                .stream()
                .map(item -> new StudyItemResponse(
                        item.getId(),
                        item.getCategory() != null ? item.getCategory().getId() : null,
                        item.getTitle(),
                        item.getInstitution(),
                        item.getLink(),
                        item.getPriority(),
                        item.getDeadline(),
                        item.getNotes(),
                        item.getTotalHours(),
                        item.getDoneHours(),
                        item.getStatus(),
                        item.getCompletedAt(),
                        item.getModifiedAt(),
                        item.getCreatedAt()
                ))
                .toList();
    }

    /**
     * Updates a study item of the authenticated user.
     *
     * <p>Fields are validated like in {@link #create}, except for the optional ones (category,
     * link, deadline and notes), which are cleared when {@code null}. {@code doneHours} must be
     * between 0 and {@code totalHours}, and {@code active} is required.
     *
     * <p>The status is not informed by the client, it is derived from the hours: {@code TODO} when
     * {@code doneHours} is 0, {@code DONE} when it reaches {@code totalHours}, and
     * {@code IN_PROGRESS} otherwise.
     *
     * <p>{@code completedAt} is managed by the service: it is filled when the status changes to
     * {@code DONE} and cleared when the status changes to any other value. If the item was
     * already {@code DONE} and stays {@code DONE}, the original date is kept.
     *
     * <p>{@code active} works as a soft delete: sending {@code false} deactivates the item
     * without removing it from the database, and sending {@code true} reactivates it.
     *
     * <p>The item is always searched among the ones owned by the authenticated user, so an
     * item from another user is treated as not found.
     *
     * @param user the authenticated user, resolved from the JWT
     * @param id   the id of the item to update, taken from the URL
     * @param req  the study item data
     * @return a {@link StudyItemResponse} with the updated item's data
     * @throws ResponseStatusException if id or a required field is missing or invalid (CODE 400),
     *                                 the authenticated user no longer exists (CODE 401),
     *                                 or the item or the informed category does not exist for this user (CODE 404)
     */
    @Transactional
    public StudyItemResponse update(User user, Long id, StudyItemUpdateRequest req) {
        // Validations
        validateId(id);
        String title = validateRequiredText(req.title(), "Title", TITLE_MIN, TITLE_MAX);
        String institution = validateRequiredText(req.institution(), "Institution", INSTITUTION_MIN, INSTITUTION_MAX);
        String link = validateOptionalText(req.link(), "Link", LINK_MAX);
        String notes = validateOptionalText(req.notes(), "Notes", NOTES_MAX);
        StudyPriority priority = validatePriority(req.priority());
        Double totalHours = validateTotalHours(req.totalHours());
        Double doneHours = validateDoneHours(req.doneHours(), totalHours);
        StudyStatus status = resolveStatus(doneHours, totalHours);
        Boolean active = validateActive(req.active());

        User userDB = userRepo.findById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        StudyItem item = repo.findByIdAndUserId(id, userDB.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Study item not found"));

        StudyCategory category = findCategory(req.categoryId(), userDB.getId());

        // Sets
        if (status == StudyStatus.DONE && item.getStatus() != StudyStatus.DONE) {
            item.setCompletedAt(Instant.now());
        } else if (status != StudyStatus.DONE) {
            item.setCompletedAt(null);
        }

        item.setCategory(category);
        item.setTitle(title);
        item.setInstitution(institution);
        item.setLink(link);
        item.setPriority(priority);
        item.setDeadline(req.deadline());
        item.setNotes(notes);
        item.setTotalHours(totalHours);
        item.setDoneHours(doneHours);
        item.setStatus(status);
        item.setActive(active);

        item = repo.save(item);

        return new StudyItemResponse(
                item.getId(),
                item.getCategory() != null ? item.getCategory().getId() : null,
                item.getTitle(),
                item.getInstitution(),
                item.getLink(),
                item.getPriority(),
                item.getDeadline(),
                item.getNotes(),
                item.getTotalHours(),
                item.getDoneHours(),
                item.getStatus(),
                item.getCompletedAt(),
                item.getModifiedAt(),
                item.getCreatedAt()
        );
    }

    //-------------------------------------------------------------------------------------------------------------

    // HELPERS
    private StudyCategory findCategory(Long categoryId, Long userId) {
        if (categoryId == null) {
            return null;
        }

        return categoryRepo.findByIdAndUserIdAndActiveTrue(categoryId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
    }

    private StudyStatus resolveStatus(Double doneHours, Double totalHours) {
        if (doneHours == 0) {
            return StudyStatus.TODO;
        }

        if (doneHours.compareTo(totalHours) >= 0) {
            return StudyStatus.DONE;
        }

        return StudyStatus.IN_PROGRESS;
    }

    // VALIDATIONS
    private void validateId(Long id) {
        if (id == null || id <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id is required and must be positive");
        }
    }

    private String validateRequiredText(String value, String field, int min, int max) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, field + " is required");
        }

        String v = value.trim().replaceAll("\\s+", " ");

        if (v.length() < min || v.length() > max) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, field + " must have between " + min + " and " + max + " characters");
        }

        return v;
    }

    private String validateOptionalText(String value, String field, int max) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String v = value.trim();

        if (v.length() > max) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, field + " must have at most " + max + " characters");
        }

        return v;
    }

    private StudyPriority validatePriority(StudyPriority priority) {
        if (priority == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Priority is required");
        }

        return priority;
    }

    private Double validateTotalHours(Double totalHours) {
        if (totalHours == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Total hours is required");
        }

        if (totalHours <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Total hours must be greater than 0");
        }

        return totalHours;
    }

    private Double validateDoneHours(Double doneHours, Double totalHours) {
        if (doneHours == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Done hours is required");
        }

        if (doneHours < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Done hours cannot be negative");
        }

        if (doneHours > totalHours) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Done hours cannot be greater than total hours");
        }

        return doneHours;
    }

    private Boolean validateActive(Boolean active) {
        if (active == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Active is required");
        }

        return active;
    }
}