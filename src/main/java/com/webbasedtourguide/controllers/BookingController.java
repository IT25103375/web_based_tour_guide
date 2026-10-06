package com.webbasedtourguide.controllers;

import com.webbasedtourguide.dto.BookingDetailsDTO;
import com.webbasedtourguide.exceptions.DiscountException;
import com.webbasedtourguide.exceptions.GuideException;
import com.webbasedtourguide.exceptions.TourException;
import com.webbasedtourguide.exceptions.UserException;
import com.webbasedtourguide.service.BookingService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/booking")
class BookingController {

    private final BookingService bookingService;

    BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_TOURIST')")
    public List<BookingDetailsDTO> getAllBookingForUser() {
        return bookingService.getAllBookingsForUser();
    }

    // Returns the created booking so the UI can show the assigned guide and final price
    @PostMapping("/book")
    @PreAuthorize("hasRole('ROLE_TOURIST')")
    public ResponseEntity<?> bookTour(BookingDetailsDTO request) {
        try {
            return ResponseEntity.ok().body(bookingService.bookNewTour(request));
        } catch (TourException | UserException | GuideException | DiscountException | EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/quote")
    @PreAuthorize("hasRole('ROLE_TOURIST')")
    public ResponseEntity<?> quote(@RequestParam Integer packageId, @RequestParam(required = false) String couponCode) {
        try {
            return ResponseEntity.ok().body(bookingService.quote(packageId, couponCode));
        } catch (TourException | DiscountException | EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cancel")
    @PreAuthorize("hasRole('ROLE_TOURIST')")
    public ResponseEntity<String> cancelTour(BookingDetailsDTO request) {
        try {
            return ResponseEntity.ok().body(bookingService.cancelTour(request).getMessage());
        } catch (TourException | UserException | EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
