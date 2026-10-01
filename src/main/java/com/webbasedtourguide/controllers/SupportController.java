package com.webbasedtourguide.controllers;

import com.webbasedtourguide.dto.RatingDTO;
import com.webbasedtourguide.dto.TicketDTO;
import com.webbasedtourguide.service.SupportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/support")
class SupportController {

    private final SupportService supportService;

    SupportController(SupportService supportService) {
        this.supportService = supportService;
    }

    @PostMapping("/ticket")
    public void createTicket(TicketDTO request) {
        supportService.createTicket(request);
    }

    @PatchMapping("/ticket/{id}")
    public void respondToTicket(@PathVariable int id, TicketDTO request) {
        supportService.respondToTicket(id, request);
    }

    @PatchMapping("/ticket/{id}/solve")
    public void solveTicket(@PathVariable int id) {
        supportService.solveTicket(id);
    }

    @GetMapping("/ticket")
    public List<TicketDTO> getUserTickets() {
        return supportService.getTickets();
    }

    @GetMapping("/ticket/{id}")
    public TicketDTO getTicket(@PathVariable int id) {
        return supportService.getTicket(id);
    }

    @PostMapping("/rating")
    public void postRating(RatingDTO request) {
        supportService.postRating(request);
    }
}
