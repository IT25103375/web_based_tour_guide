package com.webbasedtourguide.controllers;

import com.webbasedtourguide.dto.BookingDetailsDTO;
import com.webbasedtourguide.service.BookingService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/booking")
class BookingController {

    private final BookingService bookingService;

    BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_TOURIST')")
    public List<BookingDetailsDTO> getAllBookingForUser() {
        return  bookingService.getAllBookingsForUser();
    }
}
