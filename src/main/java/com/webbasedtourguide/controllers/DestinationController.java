package com.webbasedtourguide.controllers;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.DestinationDTO;
import com.webbasedtourguide.dto.TourPackageDTO;
import com.webbasedtourguide.entities.Destination;
import com.webbasedtourguide.entities.TourPackage;
import com.webbasedtourguide.exceptions.PackageException;
import com.webbasedtourguide.mappers.DestinationMapper;
import com.webbasedtourguide.mappers.TourPackageMapper;
import com.webbasedtourguide.service.DestinationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Rest api
@CrossOrigin
@RequestMapping("/api/destination")
class DestinationController {

    private final DestinationService destinationService;
    private final DestinationMapper destinationMapper;
    private final TourPackageMapper packageMapper;

    DestinationController(DestinationService destinationService, DestinationMapper destinationMapper, TourPackageMapper packageMapper) {
        this.destinationService = destinationService;
        this.destinationMapper = destinationMapper;
        this.packageMapper = packageMapper;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public ResponseEntity<String> addDestination(@Valid @RequestBody DestinationDTO request) {

        // TODO: properly implement response system; decide between ResponseEntity and custom BasicResponse
        try {
           return ResponseEntity.ok().body(destinationService.addDestination(request).getMessage());

        } catch (PackageException e) {
            return ResponseEntity.badRequest().body(e.getMessage());}
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public ResponseEntity<String> editDestination(@Valid @RequestBody DestinationDTO request) {
        return ResponseEntity.ok().body(destinationService.editDestination(request).getMessage());
    }

    @DeleteMapping
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public ResponseEntity<String> removeDestination(@Valid @RequestBody DestinationDTO request) {
        try {
            return ResponseEntity.ok().body(destinationService.removeDestination(request).getMessage());
        } catch (PackageException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/destination")
    public ResponseEntity<List<TourPackageDTO>> getPackagesByDestination(@Valid @RequestBody DestinationDTO request) {
        return ResponseEntity.ok().body(packageMapper.
                toDtoList(destinationService.getPackagesByDestination(request.getId())));
    }

    @GetMapping
    public List<DestinationDTO> getDestinations() {
        return destinationMapper.toDtoList(destinationService.getDestinations());
    }
}
