package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.RatingDTO;
import com.webbasedtourguide.dto.TicketDTO;
import com.webbasedtourguide.dto.UserMessageDTO;
import com.webbasedtourguide.entities.AuthEntity;
import com.webbasedtourguide.entities.Rating;
import com.webbasedtourguide.entities.Ticket;
import com.webbasedtourguide.entities.UserMessage;
import com.webbasedtourguide.enums.RatingType;
import com.webbasedtourguide.enums.TicketStatus;
import com.webbasedtourguide.enums.UserType;
import com.webbasedtourguide.exceptions.UserException;
import com.webbasedtourguide.mappers.ServiceMapper;
import com.webbasedtourguide.repositories.RatingRepository;
import com.webbasedtourguide.repositories.TicketRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupportService {

    private final ServiceMapper serviceMapper;
    private final TicketRepository ticketRepository;
    private final RatingRepository ratingRepository;
    private final UserService userService;
    private final TourPackageService tourPackageService;
    private final TourGuideService tourGuideService;
    private final DestinationService destinationService;
    private final EventService eventService;

    SupportService(ServiceMapper serviceMapper, TicketRepository ticketRepository, RatingRepository ratingRepository,
                   UserService userService, TourPackageService tourPackageService,
                   TourGuideService tourGuideService, DestinationService destinationService, EventService eventService) {
        this.serviceMapper = serviceMapper;
        this.ticketRepository = ticketRepository;
        this.ratingRepository = ratingRepository;
        this.userService = userService;
        this.tourPackageService = tourPackageService;
        this.tourGuideService = tourGuideService;
        this.destinationService = destinationService;
        this.eventService = eventService;
    }

    @Transactional
    public TicketDTO createTicket(TicketDTO request) {

        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.addMessage(new UserMessage(userService.getCurrentUser(), request.getMessages().getFirst().getContent()));

        return serviceMapper.toDto(ticketRepository.save(ticket));
    }

    @Transactional
    public void respondToTicket(int id, TicketDTO request) {

        Ticket ticket = ticketRepository.findById((long) id)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found"));

        AuthEntity current = userService.getCurrentUser();
        if (!isAdmin(current) && !ticket.hasObserver(current))
            throw new UserException("Unauthorized access");
        if (ticket.getStatus() == TicketStatus.SOLVED)
            throw new UserException("This ticket has been solved");

        ticket.addMessage(new UserMessage(current, request.getFirstMessage().getContent()));

        ticketRepository.save(ticket);
    }

    private static boolean isAdmin(AuthEntity user) {
        return user.getUserType() == UserType.AGENCYSTAFF || user.getUserType() == UserType.TOURMANAGER;
    }

    // Summary for list views: id, title, status and the opening message (which carries the sender)
    private TicketDTO toSummaryDto(Ticket ticket) {
        TicketDTO dto = new TicketDTO();
        dto.setId(Math.toIntExact(ticket.getId()));
        dto.setTitle(ticket.getTitle());
        dto.setStatus(ticket.getStatus());
        dto.addMessage(serviceMapper.toDto(ticket.getFirstMessage()));
        return dto;
    }

    @Transactional
    public List<TicketDTO> getTickets() {
        return ticketRepository.getTicketsSubscribedTo(userService.getCurrentUser().getId()).
                stream().map(this::toSummaryDto).collect(Collectors.toList());
    }

    // Admin view: every ticket from every user, newest first
    @Transactional
    public List<TicketDTO> getAllTickets() {
        return ticketRepository.findAllByOrderByIdDesc().stream()
                .map(this::toSummaryDto).collect(Collectors.toList());
    }

    @Transactional
    public TicketDTO getTicket(int id) {
        Ticket ticket = ticketRepository.findById((long) id)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found"));

        AuthEntity current = userService.getCurrentUser();
        if (!isAdmin(current) && !ticket.hasObserver(current))
            throw new UserException("Unauthorized access");

        return serviceMapper.toDto(ticket);
    }

    @Transactional
    public void solveTicket(int ticketId) {

        Ticket ticket = ticketRepository.findById((long) ticketId)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found"));
        if (ticket.getStatus() == TicketStatus.SOLVED)
            throw new UserException("This ticket is already solved");
        ticket.solveTicket();

        ticketRepository.save(ticket);
    }



    @Transactional
    public void postRating(RatingDTO request) {

        Rating rating = new Rating(userService.getCurrentUser(), request.getMessage(),
                request.getRating(), request.getType());
        ratingRepository.save(rating);

        switch (rating.getType()) {
            case TOURPACKAGE -> tourPackageService.addRating(request.getTypeId(), rating);
            case TOURGUIDE -> tourGuideService.addRating(request.getTypeId(), rating);
            case DESTINATION -> destinationService.addRating(request.getTypeId(), rating);
            case EVENT -> eventService.addRating(request.getTypeId(), rating);
            default -> throw new RuntimeException("Invalid rating type");
        }
    }

    @Transactional
    public List<RatingDTO> getRatings(RatingType type, int typeId) {

        List<Rating> ratings = switch (type) {
            case TOURPACKAGE -> tourPackageService.getRatings(typeId, Integer.MAX_VALUE);
            case TOURGUIDE -> tourGuideService.getRatings(typeId, Integer.MAX_VALUE);
            case DESTINATION -> destinationService.getRatings(typeId, Integer.MAX_VALUE);
            case EVENT -> eventService.getRatings(typeId, Integer.MAX_VALUE);
        };

        return ratings.stream().map(rating -> {
            RatingDTO dto = new RatingDTO();
            dto.setRating(rating.getStarRating());
            dto.setMessage(rating.getContent());
            dto.setType(type);
            dto.setTypeId(typeId);
            return dto;
        }).collect(Collectors.toList());
    }
}