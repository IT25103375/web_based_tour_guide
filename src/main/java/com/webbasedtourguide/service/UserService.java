package com.webbasedtourguide.service;

import com.webbasedtourguide.auth.JwtUtil;
import com.webbasedtourguide.dto.TokenResponse;
import com.webbasedtourguide.entities.AuthEntity;
import com.webbasedtourguide.enums.UserType;
import com.webbasedtourguide.repositories.AuthEntityRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthEntityRepository authEntityRepository;

    //@Autowired
    //private User1Repository user1Repository;

    //@Autowired
    //private User2Repository user2Repository;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public Object addUser(String username, String email, String rawPassword, UserType userType) {

        // Reject invalid type or admin type(Not implemented)
        if (userType != UserType.USER1 && userType != UserType.USER2) throw new RuntimeException("Unauthorized");

        // Reject if email exists
        if (authEntityRepository.findByEmail(email).isPresent())
            throw new RuntimeException("Account with email already exists");

        // Save auth info
        AuthEntity auth = new AuthEntity();
        auth.setUsername(username);
        auth.setEmail(email);
        auth.setPassword(passwordEncoder.encode(rawPassword));
        auth.setUserType(userType);

        // Construct and save the appropriate user type to correct repository
        if (userType == UserType.USER1) {

            // User1 user1 = new User1();
            // user1.setAuthEntity(auth);
            // auth.setUser1(user1);
            authEntityRepository.save(auth);
            // user1Repository.save(user1);
            // return whatever is needed
        }

        throw new RuntimeException("Register error");
    }

    @Transactional
    public TokenResponse login(String email, String rawPassword) {
        TokenResponse token = new TokenResponse();

        //Verify user is in DB
        Optional<AuthEntity> opAuth = authEntityRepository.findByEmail(email);
        if (opAuth.isEmpty() ||
                !passwordEncoder.matches(rawPassword, opAuth.get().getPassword())) {

            token.setSuccess(false);
            token.setError("Invalid Username or Password");
        }
        else {
            token.setToken(jwtUtil.generateToken(opAuth.get().getEmail()));
            token.setRole(opAuth.get().getUserType().name());
        }

        return token;
    }

    // TODO: Implement logout with a blacklist cache since JWT is stateless

//    @PreAuthorize("hasRole('ROLE_PASSENGER')")
//    @Transactional
//    public User1 getCurrentUser1() {
//        return user1Repository.findByEmail(((AuthEntity) SecurityContextHolder.getContext().
//                getAuthentication().getPrincipal()).getEmail())
//                .orElseThrow(() -> new RuntimeException("No such user1"));
//    }

//    @PreAuthorize("hasRole('ROLE_DRIVER')")
//    @Transactional
//    public User2 getCurrentUser2() {
//        return user2Repository.findByEmail(((AuthEntity) SecurityContextHolder.getContext().
//                getAuthentication().getPrincipal()).getEmail())
//                .orElseThrow(() -> new RuntimeException("No such user2"));
//    }
}
