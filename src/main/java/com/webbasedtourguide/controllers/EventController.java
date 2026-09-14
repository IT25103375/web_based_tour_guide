package com.webbasedtourguide.controllers;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.EventControlDTO;
import com.webbasedtourguide.dto.EventDetailsDTO;
import com.webbasedtourguide.entities.Event;
import com.webbasedtourguide.exceptions.EventException;
import com.webbasedtourguide.exceptions.PackageException;
import com.webbasedtourguide.mappers.EventMapper;
import com.webbasedtourguide.repositories.EventRegistrationRepository;
import com.webbasedtourguide.service.EventService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final EventRegistrationRepository eventRegistrationRepository;

    public EventController(EventService eventService,
                            EventRegistrationRepository eventRegistrationRepository) {
        this.eventService = eventService;
        this.eventRegistrationRepository = eventRegistrationRepository;
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
        // ASSUMPTION: TourPackage isn't fetched here yet — pass null for now.
        // Once you confirm how TourPackageService/Repository looks up a package by id,
        // fetch the real TourPackage and pass it in instead of null.
        return EventMapper.toDetailsDTO(event.get(), null);
    }

    // NOT YET IMPLEMENTED: register endpoint.
    // Blocked on two things I don't have yet:
    //   1. EventRegistrationService (needs to be written once EventRegistration entity is confirmed)
    //   2. How the logged-in tourist's id is read from the request (JwtAuthFilter / SecurityContext) —
    //      need UserController.java to see the pattern used elsewhere in this project, so this
    //      endpoint matches it instead of inventing a different auth approach.
    //
    // Once those are available, this endpoint will look roughly like:
    //
    // @PostMapping("/{eventId}/register")
    // public BasicResponse register(@PathVariable Integer eventId, @PathVariable Integer bookingId,
    //                                /* tourist identity param, matching your auth pattern */) throws EventException {
    //     return eventRegistrationService.register(eventId, bookingId, touristId);
    // }
}
