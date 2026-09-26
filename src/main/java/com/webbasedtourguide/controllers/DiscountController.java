package com.webbasedtourguide.controllers;

import com.webbasedtourguide.dto.DiscountDTO;
import com.webbasedtourguide.service.DiscountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/discount")
class DiscountController {

    private final DiscountService discountService;

    DiscountController(DiscountService discountService) {
        this.discountService = discountService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public List<DiscountDTO> getAllDiscounts() {
        return discountService.getAllDiscounts();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public ResponseEntity<String> addDiscount(@RequestBody DiscountDTO request) {
        return ResponseEntity.ok().body(discountService.addDiscount(request).getMessage());
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public ResponseEntity<String> editDiscount(@RequestBody DiscountDTO request) {
        return ResponseEntity.ok().body(discountService.editDiscount(request).getMessage());
    }

    @DeleteMapping
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public ResponseEntity<String> deleteDiscount(@RequestBody DiscountDTO request) {
        return ResponseEntity.ok().body(discountService.deleteDiscount(request.getId()).getMessage());
    }
}