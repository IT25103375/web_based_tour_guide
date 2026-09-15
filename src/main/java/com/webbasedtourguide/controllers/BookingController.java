package com.webbasedtourguide.controllers;

import com.webbasedtourguide.dto.BookingDetailsDTO;
import com.webbasedtourguide.dto.EventDetailsDTO;
import com.webbasedtourguide.exceptions.GuideException;
import com.webbasedtourguide.exceptions.TourException;
import com.webbasedtourguide.exceptions.UserException;
import com.webbasedtourguide.service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    @PostMapping("/book")
    @PreAuthorize("hasRole('ROLE_TOURIST')")
    public ResponseEntity<String> bookTour(BookingDetailsDTO request) {
        try {
            return ResponseEntity.ok().body(bookingService.BookNewTour(request).getMessage());
        } catch (TourException | UserException | GuideException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cancel")
    @PreAuthorize("hasRole('ROLE_TOURIST')")
    public ResponseEntity<String> cancelTour(BookingDetailsDTO request) {
        try {
            return ResponseEntity.ok().body(bookingService.cancelTour(request).getMessage());
        } catch (TourException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
