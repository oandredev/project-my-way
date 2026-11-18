package edu.senacsp.my_way.controller;

import edu.senacsp.my_way.annotation.ApiMessage;
import edu.senacsp.my_way.dto.request.studyCategory.StudyCategoryCreateRequest;
import edu.senacsp.my_way.dto.response.studyCategory.StudyCategoryResponse;
import edu.senacsp.my_way.entity.User;
import edu.senacsp.my_way.service.StudyCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/study-category")
@CrossOrigin(origins = "${path.url}")
public class StudyCategoryController {

    private final StudyCategoryService service;

    public StudyCategoryController(StudyCategoryService service) {
        this.service = service;
    }

    @PostMapping()
    @ApiMessage("Successfully created")
    public ResponseEntity<StudyCategoryResponse> create(@AuthenticationPrincipal User user, @RequestBody StudyCategoryCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(user, req));
    }

    @GetMapping()
    @ApiMessage("Successfully loaded")
    public ResponseEntity<List<StudyCategoryResponse>> findAllByUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.OK).body(service.findAllByUser(user));
    }
}
