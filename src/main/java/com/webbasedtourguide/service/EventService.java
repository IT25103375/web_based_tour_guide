package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.EventControlDTO;
import com.webbasedtourguide.entities.Event;
import com.webbasedtourguide.entities.TourBooking;
import com.webbasedtourguide.exceptions.EventException;
import com.webbasedtourguide.exceptions.PackageException;
import com.webbasedtourguide.repositories.EventBookingRepository;
import com.webbasedtourguide.repositories.EventRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventBookingRepository eventBookingRepository;
    private final TourPackageService tourPackageService;

    EventService(EventRepository eventRepository,
                 EventBookingRepository eventBookingRepository,
                 TourPackageService tourPackageService) {
        this.eventRepository = eventRepository;
        this.eventBookingRepository = eventBookingRepository;
        this.tourPackageService = tourPackageService;
    }

    @Transactional
    public BasicResponse createNewEvent(EventControlDTO request) throws PackageException {

        Event event = new Event();
        event.setDisplayName(request.getEventName());
        event.setLocation(request.getLocation());
        event.setPrice(request.getPrice());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());
        event.setApplicablePackages(tourPackageService.getPackages(request.getApplicablePackages()));
        eventRepository.save(event);

        return BasicResponse.ok();
    }

    @Transactional
    public BasicResponse discontinueEvent(EventControlDTO request) throws EventException {

        // FIX: was request.getBookingId() — the query matches Event.id, not a booking id
        if (eventRepository.discontinueEvent(request.getEventId(), Instant.now()) == 1) {
            return BasicResponse.ok();
        }
        throw new EventException("Error discontinuing event");
    }

    public Optional<Event> getValidEvent(Integer eventId, Integer pkgId) {
        return eventRepository.getValidEvent(eventId, pkgId, Instant.now());
    }

    // Registers a tourist for an event by linking their existing TourBooking to it.
    @Transactional
    public BasicResponse registerForEvent(Integer bookingId, Integer eventId, Integer touristId) throws EventException {

        TourBooking booking = eventBookingRepository.findByIdAndBooker_Id(bookingId, touristId)
                .orElseThrow(() -> new EventException("Booking not found for this tourist"));

        if (booking.getEvent() != null) {
            throw new EventException("This booking is already registered for an event");
        }

        // Confirm the event hasn't started and is covered by this booking's package
        Event event = eventRepository.getValidEvent(eventId, booking.getTourPackage().getId(), Instant.now())
                .orElseThrow(() -> new EventException("Event is not available for this tourist's package"));

        int updated = eventBookingRepository.registerForEvent(bookingId, event, touristId);
        if (updated != 1) {
            throw new EventException("Could not complete registration");
        }

        return BasicResponse.ok();
    }

    public long getParticipantCount(Integer eventId) {
        return eventBookingRepository.countByEvent_Id(eventId);
    }
}
