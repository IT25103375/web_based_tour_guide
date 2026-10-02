package com.webbasedtourguide.controllers;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.DiscountDTO;
import com.webbasedtourguide.exceptions.DiscountException;
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
        return toResponse(discountService.addDiscount(request));
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public ResponseEntity<String> editDiscount(@RequestBody DiscountDTO request) {
        try {
            return toResponse(discountService.editDiscount(request));
        } catch (DiscountException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public ResponseEntity<String> deleteDiscount(@RequestBody DiscountDTO request) {
        return ResponseEntity.ok().body(discountService.deleteDiscount(request.getId()).getMessage());
    }

    private ResponseEntity<String> toResponse(BasicResponse response) {
        return response.isSuccess()
                ? ResponseEntity.ok().body(response.getMessage())
                : ResponseEntity.badRequest().body(response.getMessage());
    }
}
