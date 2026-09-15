package com.webbasedtourguide.controllers;

import com.webbasedtourguide.dto.TourPackageDTO;
import com.webbasedtourguide.service.TourPackageService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/pacakge")
class TourPackageController {

    private final TourPackageService tourPackageService;

    TourPackageController(TourPackageService tourPackageService) {
        this.tourPackageService = tourPackageService;
    }

    @GetMapping
    public List<TourPackageDTO> getAllPackages() {
        return tourPackageService.getAllPackages();
    }
}
