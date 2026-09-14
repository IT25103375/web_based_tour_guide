package com.webbasedtourguide.controllers;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.EventControlDTO;
import com.webbasedtourguide.dto.EventDetailsDTO;
import com.webbasedtourguide.entities.Event;
import com.webbasedtourguide.exceptions.EventException;
import com.webbasedtourguide.exceptions.PackageException;
import com.webbasedtourguide.mappers.EventMapper;
import com.webbasedtourguide.service.EventService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // Admin: create a new event
    @PostMapping
    public BasicResponse createEvent(@Valid @RequestBody EventControlDTO request) throws PackageException {
        return eventService.createNewEvent(request);
    }

    // Admin: discontinue/delete an event
    @PostMapping("/discontinue")
    public BasicResponse discontinueEvent(@Valid @RequestBody EventControlDTO request) throws EventException {
        return eventService.discontinueEvent(request);
    }

    // Tourist: check eligibility + get event details for a given package
    @GetMapping("/{eventId}/package/{pkgId}")
    public EventDetailsDTO getEventDetails(@PathVariable Integer eventId, @PathVariable Integer pkgId)
            throws EventException {
        Optional<Event> event = eventService.getValidEvent(eventId, pkgId);
        if (event.isEmpty()) {
            throw new EventException("Event not available for the selected package");
        }
        return EventMapper.toDetailsDTO(event.get(), null);
    }

    // Tourist: register for an event using an existing booking.
    // NOTE: touristId is taken as a request param here as a placeholder -- once
    // the auth side of the project exposes the logged-in tourist's id (e.g. via
    // SecurityContextHolder, same pattern as UserController.testLogin()), swap
    // this param for that instead of trusting a value the client sends.
    @PostMapping("/register")
    public BasicResponse registerForEvent(@RequestParam Integer bookingId,
                                          @RequestParam Integer eventId,
                                          @RequestParam Integer touristId) throws EventException {
        return eventService.registerForEvent(bookingId, eventId, touristId);
    }

    // Participation count for an event
    @GetMapping("/{eventId}/participants")
    public long getParticipantCount(@PathVariable Integer eventId) {
        return eventService.getParticipantCount(eventId);
    }
}
