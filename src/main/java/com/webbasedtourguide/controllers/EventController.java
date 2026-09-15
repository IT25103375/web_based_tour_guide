package com.webbasedtourguide.controllers;

import com.webbasedtourguide.dto.EventDetailsDTO;
import com.webbasedtourguide.service.EventService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/event")
class EventController {

    private final EventService eventService;

    EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping()
    public List<EventDetailsDTO> getAllEventsByPackageId(@RequestBody Integer pkgId) {
        return eventService.getValidEvents(pkgId);
    }
}
