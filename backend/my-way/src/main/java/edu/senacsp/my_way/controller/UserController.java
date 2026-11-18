package edu.senacsp.my_way.controller;

import edu.senacsp.my_way.annotation.ApiMessage;

import edu.senacsp.my_way.dto.request.user.LoginRequest;
import edu.senacsp.my_way.dto.request.user.SignupRequest;
import edu.senacsp.my_way.dto.request.user.UpdatePasswordRequest;
import edu.senacsp.my_way.dto.request.user.UpdateUserRequest;
import edu.senacsp.my_way.dto.response.user.AuthResponse;
import edu.senacsp.my_way.dto.response.user.UserResponse;

import edu.senacsp.my_way.entity.User;

import edu.senacsp.my_way.service.UserService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "${path.url}")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping("/signup")
    @ApiMessage("Successfully created")
    public ResponseEntity<UserResponse> signup(@RequestBody SignupRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.signup(req));
    }

    @PostMapping("/login")
    @ApiMessage("Login successful")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest req) {
        AuthResponse response = service.login(req);

        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + response.token())
                .body(response.userResponse());
    }

    @PutMapping()
    @ApiMessage("User successfully edited")
    public ResponseEntity<UserResponse> update(@AuthenticationPrincipal User user, @RequestBody UpdateUserRequest req) {
        return ResponseEntity.status(HttpStatus.OK).body(service.update(user, req));
    }

    @PutMapping("/password")
    @ApiMessage("Password successfully edited")
    public ResponseEntity<UserResponse> updatePassword(@AuthenticationPrincipal User user, @RequestBody UpdatePasswordRequest req) {
        return ResponseEntity.status(HttpStatus.OK).body(service.updatePassword(user, req));
    }
}
