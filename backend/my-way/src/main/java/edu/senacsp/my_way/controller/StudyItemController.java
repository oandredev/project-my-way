package edu.senacsp.my_way.controller;

import edu.senacsp.my_way.annotation.ApiMessage;
import edu.senacsp.my_way.dto.request.studyItem.StudyItemCreateRequest;
import edu.senacsp.my_way.dto.request.studyItem.StudyItemUpdateRequest;
import edu.senacsp.my_way.dto.response.studyItem.StudyItemResponse;
import edu.senacsp.my_way.entity.User;
import edu.senacsp.my_way.service.StudyItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/study-item")
@CrossOrigin(origins = "${path.url}")
public class StudyItemController {

    private final StudyItemService service;

    public StudyItemController(StudyItemService service) {
        this.service = service;
    }

    @PostMapping
    @ApiMessage("Successfully created")
    public ResponseEntity<StudyItemResponse> create(@AuthenticationPrincipal User user,
                                                    @RequestBody StudyItemCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(user, req));
    }

    @GetMapping
    @ApiMessage("Successfully loaded")
    public ResponseEntity<List<StudyItemResponse>> findAllByUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.OK).body(service.findAllByUser(user));
    }

    @PutMapping("/{id}")
    @ApiMessage("Successfully updated")
    public ResponseEntity<StudyItemResponse> update(@AuthenticationPrincipal User user,
                                                    @PathVariable Long id,
                                                    @RequestBody StudyItemUpdateRequest req) {
        return ResponseEntity.status(HttpStatus.OK).body(service.update(user, id, req));
    }
}
