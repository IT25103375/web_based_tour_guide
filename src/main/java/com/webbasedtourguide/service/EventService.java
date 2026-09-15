package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.EventControlDTO;
import com.webbasedtourguide.dto.EventDetailsDTO;
import com.webbasedtourguide.entities.Event;
import com.webbasedtourguide.entities.TourPackage;
import com.webbasedtourguide.exceptions.EventException;
import com.webbasedtourguide.exceptions.PackageException;
import com.webbasedtourguide.mappers.EventMapper;
import com.webbasedtourguide.repositories.EventRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final TourPackageService tourPackageService;
    private final EventMapper eventMapper;

    EventService(EventRepository eventRepository, TourPackageService tourPackageService, EventMapper eventMapper) {
        this.eventRepository = eventRepository;
        this.tourPackageService = tourPackageService;
        this.eventMapper = eventMapper;
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
        event.setCapacity(request.getCapacity());
        eventRepository.save(event);

        return BasicResponse.ok();
    }

    @Transactional
    public BasicResponse editEvent(EventControlDTO request) throws EventException, PackageException {

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new EventException("No such event"));

        if (request.getEventName() != null && !request.getEventName().isBlank()) event.setDisplayName(request.getEventName());
        if (request.getLocation() != null && !request.getLocation().isBlank()) event.setLocation(request.getLocation());
        if (request.getPrice() != null) event.setPrice(request.getPrice());
        if (request.getStartDate() != null) event.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) event.setEndDate(request.getEndDate());
        if (request.getCapacity() != null) event.setCapacity(request.getCapacity());
        if (request.getApplicablePackages() != null && !request.getApplicablePackages().isEmpty())
            event.setApplicablePackages(tourPackageService.getPackages(request.getApplicablePackages()));
        eventRepository.save(event);

        return BasicResponse.ok();
    }

    @Transactional
    public BasicResponse deleteEvent(Integer id) {
        eventRepository.deleteById(id);
        return BasicResponse.ok();
    }

    public List<EventControlDTO> getAllEventsAdmin() {
        List<Event> events = (List<Event>) eventRepository.findAll();
        return events.stream().map(this::toControlDto).collect(Collectors.toList());
    }

    private EventControlDTO toControlDto(Event event) {
        EventControlDTO dto = new EventControlDTO();
        dto.setEventId(event.getId());
        dto.setEventName(event.getDisplayName());
        dto.setLocation(event.getLocation());
        dto.setPrice(event.getPrice());
        dto.setStartDate(event.getStartDate());
        dto.setEndDate(event.getEndDate());
        dto.setCapacity(event.getCapacity());
        dto.setApplicablePackages(event.getApplicablePackages() == null ? List.of() :
                event.getApplicablePackages().stream().map(TourPackage::getId).collect(Collectors.toList()));
        return dto;
    }

    @Transactional
    public BasicResponse discontinueEvent(EventControlDTO request) throws EventException {

        if (eventRepository.discontinueEvent(request.getBookingId(), Instant.now()) == 1) {
            return BasicResponse.ok();
        }
        throw new EventException("Error discontinuing event");
    }

    public Optional<Event> getValidEvent(Integer eventId, Integer pkgId) {
        return eventRepository.getValidEvent(eventId, pkgId, Instant.now());
    }

    public List<EventDetailsDTO> getValidEvents(Integer pkgId) {
        return eventMapper.toDtoList(eventRepository.getValidEvents(pkgId, Instant.now()));
    }
}