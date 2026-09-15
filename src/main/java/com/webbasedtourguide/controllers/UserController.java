package com.webbasedtourguide.controllers;
import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.LoginRequest;
import com.webbasedtourguide.dto.RegisterRequest;
import com.webbasedtourguide.dto.TokenResponse;
import com.webbasedtourguide.exceptions.RegisterException;
import com.webbasedtourguide.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController // Rest api
@CrossOrigin
@RequestMapping(path = "/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(path = "/auth/register")
    public ResponseEntity<BasicResponse> addUser(@Valid @RequestBody RegisterRequest registerRequest) {

        try {
            return ResponseEntity.ok(userService.addUser(registerRequest));
        }
        catch (RegisterException rE) {
            BasicResponse response = new BasicResponse();
            response.setSuccess(false);
            response.setMessage(rE.getMessage());
            return ResponseEntity.ok().body(response);
        }
    }

    @PostMapping(path = "/auth/login")
    public TokenResponse login(@Valid @RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @GetMapping(path = "/auth/test")
    public ResponseEntity<String> TestMethod() {
        return ResponseEntity.ok("Success");
    }

//    @GetMapping(path = "/{id}")
//    public ResponseEntity<User> getUser(@PathVariable Integer id) {
//
//
//        Optional<Passenger> passenger = passengerRepository.findById(id);
//        Optional<Driver> driver = driverRepository.findById(id);
//
//        return passenger.<ResponseEntity<User>>map(ResponseEntity::ok).orElseGet(()
//                -> driver.<ResponseEntity<User>>map(ResponseEntity::ok).orElseGet(()
//                -> ResponseEntity.notFound().build()));
//    }

    @PreAuthorize("hasRole('ROLE_STUDENT')")
    @GetMapping("/logintest")
    public ResponseEntity<Object> testLogin() {

        return ResponseEntity.ok(SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal());
    }
}
