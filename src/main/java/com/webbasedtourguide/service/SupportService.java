package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.RatingDTO;
import com.webbasedtourguide.dto.TicketDTO;
import com.webbasedtourguide.dto.UserMessageDTO;
import com.webbasedtourguide.entities.Rating;
import com.webbasedtourguide.entities.Ticket;
import com.webbasedtourguide.entities.UserMessage;
import com.webbasedtourguide.repositories.RatingRepository;
import com.webbasedtourguide.repositories.TicketRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
class SupportService {

    private final TicketRepository ticketRepository;
    private final RatingRepository ratingRepository;
    private final UserService userService;

    SupportService(TicketRepository ticketRepository, RatingRepository ratingRepository, UserService userService) {
        this.ticketRepository = ticketRepository;
        this.ratingRepository = ratingRepository;
        this.userService = userService;
    }

    @Transactional
    public void createTicket(TicketDTO request) {

        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.addMessage(new UserMessage(userService.getCurrentUser(), request.getMessage()));

        ticketRepository.save(ticket);
    }

    @Transactional
    public void respondToTicket(int ticketId, UserMessageDTO request) {

        Ticket ticket = ticketRepository.findById((long) ticketId)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found"));
        ticket.addMessage(new UserMessage(userService.getCurrentUser(), request.getMessage()));
    }

    public List<TicketDTO> getTickets() {
        return ticketRepository.getTicketsSubscribedTo(userService.getCurrentUser().getId()).
                stream().map(ticket -> {
                    TicketDTO dto = new TicketDTO();
                    dto.setId(Math.toIntExact(ticket.getId()));
                    dto.setTitle(ticket.getTitle());
                    dto.setMessage(ticket.getFirstMessage().getContent());
                    return dto;
                }).collect(Collectors.toList());
    }

    @Transactional
    public void solveTicket(int ticketId) {

        Ticket ticket = ticketRepository.findById((long) ticketId)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found"));
        ticket.solveTicket();
    }



    @Transactional
    public void postRating(RatingDTO request) {

        Rating rating = new Rating(userService.getCurrentUser(), request.getMessage(),
                request.getRating(), request.getType());

        switch (rating.getType()) {
            case TOURPACKAGE -> {

            }
        }

        ratingRepository.save(rating);
    }
}