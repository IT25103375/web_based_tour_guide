package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.EventControlDTO;
import com.webbasedtourguide.entities.Event;
import com.webbasedtourguide.exceptions.EventException;
import com.webbasedtourguide.exceptions.PackageException;
import com.webbasedtourguide.repositories.EventRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final TourPackageService tourPackageService;

    EventService(EventRepository eventRepository, TourPackageService tourPackageService) {
        this.eventRepository = eventRepository;
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

        if (eventRepository.discontinueEvent(request.getEventId(), Instant.now()) == 1) {
            return BasicResponse.ok();
        }
        throw new EventException("Error discontinuing event");
    }

    public Optional<Event> getValidEvent(Integer eventId, Integer pkgId) {
        return eventRepository.getValidEvent(eventId, pkgId, Instant.now());
    }
}
