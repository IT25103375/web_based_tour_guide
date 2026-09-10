package com.webbasedtourguide.service;

import com.webbasedtourguide.abstracts.AuthEntityDependent;
import com.webbasedtourguide.auth.JwtUtil;
import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.LoginRequest;
import com.webbasedtourguide.dto.RegisterRequest;
import com.webbasedtourguide.dto.TokenResponse;
import com.webbasedtourguide.entities.Admin;
import com.webbasedtourguide.entities.AuthEntity;
import com.webbasedtourguide.entities.TourGuide;
import com.webbasedtourguide.entities.Tourist;
import com.webbasedtourguide.enums.UserType;
import com.webbasedtourguide.exceptions.RegisterException;
import com.webbasedtourguide.repositories.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthEntityRepository authEntityRepository;

    @Autowired
    private TouristRepository touristRepository;

    @Autowired
    private TourGuideRepository tourGuideRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public BasicResponse addUser(RegisterRequest request) throws RegisterException {

        // Reject if email exists
        if (authEntityRepository.findByEmail(request.getEmail()).isPresent())
            throw new RegisterException("Account with email already exists");

        // Save auth info
        AuthEntity auth = new AuthEntity();
        auth.setUsername(request.getUsername());
        auth.setEmail(request.getEmail());
        auth.setPassword(passwordEncoder.encode(request.getPassword()));
        auth.setUserType(request.getUserType());

        // Construct and save the appropriate user type to correct repository
        if (request.getUserType() == UserType.TOURIST) {

            Tourist tourist = new Tourist();
            tourist.setAuthEntity(auth);
            auth.setTourist(tourist);
            authEntityRepository.save(auth);
            touristRepository.save(tourist);
        }

        else if (request.getUserType() == UserType.TOURGUIDE) {

            TourGuide guide = new TourGuide();

            guide.setAuthEntity(auth);
            auth.setTourGuide(guide);
            authEntityRepository.save(auth);
            tourGuideRepository.save(guide);
        }

        else if (request.getUserType() == UserType.TOURMANAGER || request.getUserType() == UserType.AGENCYSTAFF) {

            Admin admin = new Admin();

            admin.setAuthEntity(auth);
            auth.setAdmin(admin);
            authEntityRepository.save(auth);
            adminRepository.save(admin);
        }
        else throw new RegisterException("Register error");

        BasicResponse response = new BasicResponse();
        response.setSuccess(true);
        return response;
    }

    @Transactional
    public TokenResponse login(LoginRequest request) {
        TokenResponse token = new TokenResponse();

        //Verify user is in DB
        Optional<AuthEntity> opAuth = authEntityRepository.findByEmail(request.getEmail());
        if (opAuth.isEmpty() ||
                !passwordEncoder.matches(request.getPassword(), opAuth.get().getPassword())) {

            token.setSuccess(false);
            token.setError("Invalid Username or Password");
        }
        else {

            token.setSuccess(true);
            token.setUsername(opAuth.get().getUsername());
            token.setToken(jwtUtil.generateToken(opAuth.get().getEmail()));
            token.setRole(opAuth.get().getUserType().name());
        }

        return token;
    }

    // TODO: Implement logout with a blacklist cache since JWT is stateless

    @Transactional
    public Tourist getCurrentTourist() throws EntityNotFoundException {
        return touristRepository.findByAuthEntity_Email(((AuthEntity) SecurityContextHolder.getContext().
                        getAuthentication().getPrincipal()).getEmail())
                .orElseThrow(() -> new EntityNotFoundException("No such tourist"));
    }

    @PreAuthorize("hasRole('ROLE_TOURGUIDE')")
    @Transactional
    public TourGuide getCurrentGuide() throws EntityNotFoundException {
        return tourGuideRepository.findByAuthEntity_Email(((AuthEntity) SecurityContextHolder.getContext().
                        getAuthentication().getPrincipal()).getEmail())
                .orElseThrow(() -> new EntityNotFoundException("No such tour guide"));
    }

//    @PreAuthorize("hasAnyRole('ROLE_PASSENGER', 'ROLE_DRIVER')")
//    @Transactional
//    public Integer[] getCurrentUserIds() throws EntityNotFoundException {
//
//        Optional<Driver> opDriver = driverRepository.findByAuthEntity_Email(((AuthEntity) SecurityContextHolder.getContext().
//                getAuthentication().getPrincipal()).getEmail());
//        Optional<Passenger> opPassenger = passengerRepository.findByAuthEntity_Email(((AuthEntity) SecurityContextHolder.getContext().
//                getAuthentication().getPrincipal()).getEmail());
//
//        return new Integer[]{
//                opPassenger.map(User::getId).orElse(null),
//                opDriver.map(User::getId).orElse(null)
//        };
//    }

//    @PreAuthorize("hasAnyRole('ROLE_PASSENGER', 'ROLE_DRIVER')")
//    @Transactional
//    public AuthEntityDependent[] getCurrentUser() throws EntityNotFoundException {
//
//        Optional<Driver> opDriver = driverRepository.findByAuthEntity_Email(((AuthEntity) SecurityContextHolder.getContext().
//                getAuthentication().getPrincipal()).getEmail());
//        Optional<Passenger> opPassenger = passengerRepository.findByAuthEntity_Email(((AuthEntity) SecurityContextHolder.getContext().
//                getAuthentication().getPrincipal()).getEmail());
//
//        return new User[]{
//                opPassenger.orElse(null),
//                opDriver.orElse(null)
//        };
//    }
}
