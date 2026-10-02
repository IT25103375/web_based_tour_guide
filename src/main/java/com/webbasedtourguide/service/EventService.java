package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.EventControlDTO;
import com.webbasedtourguide.dto.EventDetailsDTO;
import com.webbasedtourguide.entities.Destination;
import com.webbasedtourguide.entities.Event;
import com.webbasedtourguide.entities.Rating;
import com.webbasedtourguide.entities.TourPackage;
import com.webbasedtourguide.exceptions.EventException;
import com.webbasedtourguide.exceptions.PackageException;
import com.webbasedtourguide.mappers.EventMapper;
import com.webbasedtourguide.repositories.EventRepository;
import jakarta.persistence.EntityNotFoundException;
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

    private String validate(EventControlDTO r, boolean creating) {
        if (creating && (r.getEventName() == null || r.getEventName().isBlank())) return "Event name is required";
        if (creating && (r.getLocation() == null || r.getLocation().isBlank())) return "Location is required";
        if (creating && r.getPrice() == null) return "Price is required";
        if (r.getPrice() != null && r.getPrice().signum() < 0) return "Price cannot be negative";
        if (r.getCapacity() != null && r.getCapacity() < 0) return "Capacity cannot be negative";
        if (creating && (r.getStartDate() == null || r.getEndDate() == null)) return "Start and end dates are required";
        return null;
    }

    @Transactional
    public BasicResponse createNewEvent(EventControlDTO request) throws PackageException {

        String error = validate(request, true);
        if (error != null) return BasicResponse.badRequest(error);
        if (request.getEndDate().isBefore(request.getStartDate())) return BasicResponse.badRequest("End date cannot be before start date");
        if (request.getApplicablePackages() == null || request.getApplicablePackages().isEmpty())
            return BasicResponse.badRequest("Select at least one tour package");

        Event event = new Event();
        event.setDisplayName(request.getEventName());
        event.setLocation(request.getLocation());
        event.setPrice(request.getPrice());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());
        event.setCapacity(request.getCapacity());
        event.setDescription(request.getDescription());
        eventRepository.save(event);
        // Packages own the relation, so link from their side (validates that every package exists)
        tourPackageService.setEventPackages(event, request.getApplicablePackages());

        return BasicResponse.ok();
    }

    @Transactional
    public BasicResponse editEvent(EventControlDTO request) throws EventException, PackageException {

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new EventException("No such event"));

        String error = validate(request, false);
        if (error != null) return BasicResponse.badRequest(error);

        Instant start = request.getStartDate() != null ? request.getStartDate() : event.getStartDate();
        Instant end = request.getEndDate() != null ? request.getEndDate() : event.getEndDate();
        if (end.isBefore(start)) return BasicResponse.badRequest("End date cannot be before start date");

        if (request.getApplicablePackages() != null && request.getApplicablePackages().isEmpty())
            return BasicResponse.badRequest("Select at least one tour package");

        if (request.getEventName() != null && !request.getEventName().isBlank()) event.setDisplayName(request.getEventName());
        if (request.getLocation() != null && !request.getLocation().isBlank()) event.setLocation(request.getLocation());
        if (request.getPrice() != null) event.setPrice(request.getPrice());
        event.setStartDate(start);
        event.setEndDate(end);
        if (request.getCapacity() != null) event.setCapacity(request.getCapacity());
        if (request.getDescription() != null) event.setDescription(request.getDescription());
        eventRepository.save(event);
        if (request.getApplicablePackages() != null)
            tourPackageService.setEventPackages(event, request.getApplicablePackages());

        return BasicResponse.ok();
    }

    @Transactional
    public BasicResponse deleteEvent(Integer id) {
        Event event = eventRepository.findById(id).orElse(null);
        if (event == null) return BasicResponse.badRequest("No such event");
        tourPackageService.detachEvent(event);
        eventRepository.delete(event);
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
        dto.setDescription(event.getDescription());
        dto.setAvgRating(event.getRatingAvg());
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

    @Transactional
    public void addRating(int event_id, Rating rating) {
        Event event = eventRepository.findById(event_id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        event.addRating(rating);
        eventRepository.save(event);
    }

    public List<Rating> getRatings(int event_id, int count) {
        Event event = eventRepository.findById(event_id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        return event.getRatings(count);
    }

    public double getRatingAvg(int event_id) {
        Event event = eventRepository.findById(event_id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        return event.getRatingAvg();
    }
}