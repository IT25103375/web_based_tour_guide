package com.webbasedtourguide.controllers;

import com.webbasedtourguide.dto.DestinationDTO;
import com.webbasedtourguide.dto.TourPackageDTO;
import com.webbasedtourguide.exceptions.PackageException;
import com.webbasedtourguide.service.TourPackageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/pacakge")
class TourPackageController {

    private final TourPackageService tourPackageService;

    TourPackageController(TourPackageService tourPackageService) {
        this.tourPackageService = tourPackageService;
    }

    @GetMapping
    public List<TourPackageDTO> getAllPackages() {
        return tourPackageService.getAllPackages();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public ResponseEntity<String> addPackage(@Valid @RequestBody TourPackageDTO request) {
        return ResponseEntity.ok().body(tourPackageService.addPackage(request).getMessage());
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public ResponseEntity<String> editPacakge(@Valid @RequestBody TourPackageDTO request) {
        return ResponseEntity.ok().body(tourPackageService.editPackage(request).getMessage());
    }

    @DeleteMapping
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public ResponseEntity<String> removePackage(@Valid @RequestBody TourPackageDTO request) {
        return ResponseEntity.ok().body(tourPackageService.deletePackage(request).getMessage());
    }
}
