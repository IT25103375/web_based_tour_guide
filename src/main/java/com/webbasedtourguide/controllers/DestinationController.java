package com.webbasedtourguide.controllers;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.DestinationDTO;
import com.webbasedtourguide.dto.TourPackageDTO;
import com.webbasedtourguide.entities.Destination;
import com.webbasedtourguide.entities.TourPackage;
import com.webbasedtourguide.exceptions.PackageException;
import com.webbasedtourguide.mappers.TourPackageMapper;
import com.webbasedtourguide.service.DestinationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Rest api
@CrossOrigin
@RequestMapping("/api/destination")
class DestinationController {

    private final DestinationService destinationService;
    private final TourPackageMapper packageMapper;

    DestinationController(DestinationService destinationService, TourPackageMapper packageMapper) {
        this.destinationService = destinationService;
        this.packageMapper = packageMapper;
    }

    @PostMapping
    public ResponseEntity<String> addDestination(@Valid @RequestBody DestinationDTO request) {

        // TODO: properly implement response system; decide between ResponseEntity and custom BasicResponse

        try {
            destinationService.addDestination(request);

        } catch (PackageException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<String> removeDestination(@Valid @RequestBody DestinationDTO request) {

        try {
            destinationService.removeDestination(request);
        } catch (PackageException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<TourPackageDTO>> getPackagesByDestination(@Valid @RequestBody DestinationDTO request) {

        return ResponseEntity.ok().body(packageMapper.
                toDtoList(destinationService.getPackagesByDestination(request.getId())));
    }
}
