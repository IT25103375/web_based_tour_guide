package com.webbasedtourguide.controllers;

import com.webbasedtourguide.dto.RatingDTO;
import com.webbasedtourguide.dto.TicketDTO;
import com.webbasedtourguide.enums.RatingType;
import com.webbasedtourguide.service.SupportService;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public TicketDTO createTicket(@RequestBody TicketDTO request) {
        return supportService.createTicket(request);
    }

    @PatchMapping("/ticket/{id}")
    public void respondToTicket(@PathVariable int id, @RequestBody TicketDTO request) {
        supportService.respondToTicket(id, request);
    }

    // Only staff can close a ticket
    @PatchMapping("/ticket/{id}/solve")
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public void solveTicket(@PathVariable int id) {
        supportService.solveTicket(id);
    }

    @GetMapping("/ticket")
    public List<TicketDTO> getUserTickets() {
        return supportService.getTickets();
    }

    // Admin support desk: all tickets from all users
    @GetMapping("/ticket/all")
    @PreAuthorize("hasAnyRole('ROLE_AGENCYSTAFF', 'ROLE_TOURMANAGER')")
    public List<TicketDTO> getAllTickets() {
        return supportService.getAllTickets();
    }

    @GetMapping("/ticket/{id}")
    public TicketDTO getTicket(@PathVariable int id) {
        return supportService.getTicket(id);
    }

    @PostMapping("/rating")
    public void postRating(@RequestBody RatingDTO request) {
        supportService.postRating(request);
    }

    @GetMapping("/rating")
    public List<RatingDTO> getRatings(@RequestParam RatingType type, @RequestParam int typeId) {
        return supportService.getRatings(type, typeId);
    }
}
