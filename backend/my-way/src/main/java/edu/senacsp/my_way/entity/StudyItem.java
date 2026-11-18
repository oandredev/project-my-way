package edu.senacsp.my_way.entity;

import jakarta.persistence.*;

import edu.senacsp.my_way.entity.enums.StudyStatus;
import edu.senacsp.my_way.entity.enums.StudyPriority;

import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "study_items")
public class StudyItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Optional
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private StudyCategory category;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String institution;

    // Optional
    @Column(length = 2048)
    private String link;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StudyPriority priority;

    // Optional
    private Instant deadline;

    @Column(length = 2000) // Optional
    private String notes;

    @Column(nullable = false)
    private Double totalHours;

    @Column(nullable = false)
    private Double doneHours = 0d;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StudyStatus status = StudyStatus.TODO;

    // Filled when status becomes DONE
    private Instant completedAt;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean active = true;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant modifiedAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    protected StudyItem() {
    } // Hibernate

    public StudyItem(User user, String title, String institution,
                     StudyPriority priority, Double totalHours) {
        this.user = user;
        this.title = title;
        this.institution = institution;
        this.priority = priority;
        this.totalHours = totalHours;
    }

    //-------------------------------------------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public StudyCategory getCategory() {
        return category;
    }

    public void setCategory(StudyCategory category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public StudyPriority getPriority() {
        return priority;
    }

    public void setPriority(StudyPriority priority) {
        this.priority = priority;
    }

    public Instant getDeadline() {
        return deadline;
    }

    public void setDeadline(Instant deadline) {
        this.deadline = deadline;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Double getTotalHours() {
        return totalHours;
    }

    public void setTotalHours(Double totalHours) {
        this.totalHours = totalHours;
    }

    public Double getDoneHours() {
        return doneHours;
    }

    public void setDoneHours(Double doneHours) {
        this.doneHours = doneHours;
    }

    public StudyStatus getStatus() {
        return status;
    }

    public void setStatus(StudyStatus status) {
        this.status = status;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }

    public Instant getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Instant modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
