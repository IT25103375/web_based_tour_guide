package com.webbasedtourguide.controllers;

import com.webbasedtourguide.dto.EventControlDTO;
import com.webbasedtourguide.dto.EventDetailsDTO;
import com.webbasedtourguide.exceptions.EventException;
import com.webbasedtourguide.exceptions.PackageException;
import com.webbasedtourguide.exceptions.TourException;
import com.webbasedtourguide.exceptions.UserException;
import com.webbasedtourguide.service.BookingService;
import com.webbasedtourguide.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/event")
class EventController {

    private final EventService eventService;
    private final BookingService bookingService;

    EventController(EventService eventService, BookingService bookingService) {
        this.eventService = eventService;
        this.bookingService = bookingService;
    }

    @GetMapping()
    public List<EventDetailsDTO> getAllEventsByPackageId(@RequestBody Integer pkgId) {
        return eventService.getValidEvents(pkgId);
    }

    @PostMapping("/book")
    @PreAuthorize("hasRole('ROLE_TOURIST')")
    public ResponseEntity<String> registerEvent(EventDetailsDTO request) {
        try {
            return ResponseEntity.ok().body(bookingService.registerForEvent(request).getMessage());
        } catch (TourException | UserException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- Admin CRUD (used by the admin panel's Events tab) ---

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public List<EventControlDTO> getAllEventsAdmin() {
        return eventService.getAllEventsAdmin();
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public ResponseEntity<String> createEvent(@RequestBody EventControlDTO request) {
        try {
            return ResponseEntity.ok().body(eventService.createNewEvent(request).getMessage());
        } catch (PackageException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/admin")
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public ResponseEntity<String> updateEvent(@RequestBody EventControlDTO request) {
        try {
            return ResponseEntity.ok().body(eventService.editEvent(request).getMessage());
        } catch (EventException | PackageException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/admin")
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public ResponseEntity<String> deleteEvent(@RequestBody EventControlDTO request) {
        return ResponseEntity.ok().body(eventService.deleteEvent(request.getEventId()).getMessage());
    }
}