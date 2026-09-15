package com.webbasedtourguide.service;

import com.webbasedtourguide.auth.JwtUtil;
import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.LoginRequest;
import com.webbasedtourguide.dto.RegisterRequest;
import com.webbasedtourguide.dto.TokenResponse;
import com.webbasedtourguide.dto.UserAdminDTO;
import com.webbasedtourguide.entities.Admin;
import com.webbasedtourguide.entities.AuthEntity;
import com.webbasedtourguide.entities.TourGuide;
import com.webbasedtourguide.entities.Tourist;
import com.webbasedtourguide.enums.UserType;
import com.webbasedtourguide.exceptions.RegisterException;
import com.webbasedtourguide.exceptions.UserException;
import com.webbasedtourguide.repositories.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final AuthEntityRepository authEntityRepository;
    private final TouristRepository touristRepository;
    private final TourGuideRepository tourGuideRepository;
    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;

    public UserService(PasswordEncoder passwordEncoder, AuthEntityRepository authEntityRepository,
                       TouristRepository touristRepository, TourGuideRepository tourGuideRepository,
                       AdminRepository adminRepository, JwtUtil jwtUtil) {
        this.passwordEncoder = passwordEncoder;
        this.authEntityRepository = authEntityRepository;
        this.touristRepository = touristRepository;
        this.tourGuideRepository = tourGuideRepository;
        this.adminRepository = adminRepository;
        this.jwtUtil = jwtUtil;
    }

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
            token.setMessage("Invalid Username or Password");
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

    // --- Admin user management (used by the admin panel's Users tab) ---

    public List<UserAdminDTO> getAllUsers() {
        List<AuthEntity> all = (List<AuthEntity>) authEntityRepository.findAll();
        return all.stream()
                .map(a -> new UserAdminDTO(a.getId(), a.getUsername(), a.getEmail(), a.getUserType()))
                .collect(Collectors.toList());
    }

    @Transactional
    public BasicResponse updateUserRole(Integer id, UserType newType) throws UserException {
        AuthEntity auth = authEntityRepository.findById(id)
                .orElseThrow(() -> new UserException("No such user"));

        if (auth.getUserType() == newType) return BasicResponse.ok();

        // Detach and remove the old role-specific record
        if (auth.getTourist() != null) { touristRepository.deleteById(auth.getTourist().getId()); auth.setTourist(null); }
        if (auth.getTourGuide() != null) { tourGuideRepository.deleteById(auth.getTourGuide().getId()); auth.setTourGuide(null); }
        if (auth.getAdmin() != null) { adminRepository.deleteById(auth.getAdmin().getId()); auth.setAdmin(null); }

        auth.setUserType(newType);

        // Create the new role-specific record, mirroring addUser()
        if (newType == UserType.TOURIST) {
            Tourist tourist = new Tourist();
            tourist.setAuthEntity(auth);
            auth.setTourist(tourist);
            authEntityRepository.save(auth);
            touristRepository.save(tourist);
        } else if (newType == UserType.TOURGUIDE) {
            TourGuide guide = new TourGuide();
            guide.setAuthEntity(auth);
            auth.setTourGuide(guide);
            authEntityRepository.save(auth);
            tourGuideRepository.save(guide);
        } else {
            Admin admin = new Admin();
            admin.setAuthEntity(auth);
            auth.setAdmin(admin);
            authEntityRepository.save(auth);
            adminRepository.save(admin);
        }

        return BasicResponse.ok();
    }

    @Transactional
    public BasicResponse deleteUser(Integer id) throws UserException {
        AuthEntity auth = authEntityRepository.findById(id)
                .orElseThrow(() -> new UserException("No such user"));

        if (auth.getTourist() != null) touristRepository.deleteById(auth.getTourist().getId());
        if (auth.getTourGuide() != null) tourGuideRepository.deleteById(auth.getTourGuide().getId());
        if (auth.getAdmin() != null) adminRepository.deleteById(auth.getAdmin().getId());
        authEntityRepository.deleteById(id);

        return BasicResponse.ok();
    }

    @Transactional
    public Tourist getCurrentTourist() {
        return touristRepository.findByAuthEntity_Email(((AuthEntity) SecurityContextHolder.getContext().
                        getAuthentication().getPrincipal()).getEmail())
                .orElseThrow(() -> new EntityNotFoundException("No such tourist"));
    }

    @Transactional
    public TourGuide getCurrentGuide() {
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