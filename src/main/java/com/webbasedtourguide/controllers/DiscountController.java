package com.webbasedtourguide.controllers;

import com.webbasedtourguide.dto.*;
import com.webbasedtourguide.enums.DiscountTimeType;
import com.webbasedtourguide.service.DiscountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Discounts & Promotions REST API.
 * Errors are converted to JSON by DiscountExceptionHandler, so no try/catch here.
 */
@RestController
@CrossOrigin
@RequestMapping("/api/discounts")
public class DiscountController {

    private static final String STAFF_OR_MANAGER = "hasAnyRole('AGENCYSTAFF','TOURMANAGER')";

    private final DiscountService discountService;

    public DiscountController(DiscountService discountService) {
        this.discountService = discountService;
    }

    // ---------------- ADMIN / STAFF : CRUD ----------------

    // READ all  -> GET /api/discounts?type=CODE&status=ACTIVE
    @PreAuthorize(STAFF_OR_MANAGER)
    @GetMapping
    public ResponseEntity<List<DiscountResponseDTO>> getAll(
            @RequestParam(required = false) DiscountTimeType type,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(discountService.getAllDiscounts(type, status));
    }

    // Package picker for the form -> GET /api/discounts/package-options
    @PreAuthorize(STAFF_OR_MANAGER)
    @GetMapping("/package-options")
    public ResponseEntity<List<PackageSummaryDTO>> getPackageOptions() {
        return ResponseEntity.ok(discountService.getPackageOptions());
    }

    // READ one -> GET /api/discounts/5
    @PreAuthorize(STAFF_OR_MANAGER)
    @GetMapping("/{id}")
    public ResponseEntity<DiscountResponseDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(discountService.getDiscountById(id));
    }

    // CREATE -> POST /api/discounts
    @PreAuthorize(STAFF_OR_MANAGER)
    @PostMapping
    public ResponseEntity<DiscountResponseDTO> create(@Valid @RequestBody DiscountRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(discountService.createDiscount(request));
    }

    // UPDATE -> PUT /api/discounts/5
    @PreAuthorize(STAFF_OR_MANAGER)
    @PutMapping("/{id}")
    public ResponseEntity<DiscountResponseDTO> update(@PathVariable Integer id,
                                                      @Valid @RequestBody DiscountRequestDTO request) {
        return ResponseEntity.ok(discountService.updateDiscount(id, request));
    }

    // ENABLE / DISABLE -> PUT /api/discounts/5/status   { "active": false }
    // (PUT instead of PATCH because the project's CORS config allows GET/POST/PUT/DELETE only)
    @PreAuthorize(STAFF_OR_MANAGER)
    @PutMapping("/{id}/status")
    public ResponseEntity<DiscountResponseDTO> updateStatus(@PathVariable Integer id,
                                                            @Valid @RequestBody DiscountStatusDTO request) {
        return ResponseEntity.ok(discountService.updateStatus(id, request.getActive()));
    }

    // DELETE -> DELETE /api/discounts/5
    @PreAuthorize(STAFF_OR_MANAGER)
    @DeleteMapping("/{id}")
    public ResponseEntity<BasicResponse> delete(@PathVariable Integer id) {
        discountService.deleteDiscount(id);
        return ResponseEntity.ok(new BasicResponse(true, "Discount deleted"));
    }

    // ---------------- TOURIST : any logged-in user ----------------

    // Best automatic discount -> GET /api/discounts/package/3/best
    @GetMapping("/package/{packageId}/best")
    public ResponseEntity<DiscountPreviewDTO> bestForPackage(@PathVariable Integer packageId) {
        return ResponseEntity.ok(discountService.getBestDiscountPreview(packageId));
    }

    // Check coupon -> POST /api/discounts/validate-coupon  { "couponCode":"SUMMER25", "packageId":3 }
    @PostMapping("/validate-coupon")
    public ResponseEntity<DiscountPreviewDTO> validateCoupon(
            @Valid @RequestBody CouponValidationRequestDTO request) {
        return ResponseEntity.ok(discountService.validateCoupon(request));
    }
}
