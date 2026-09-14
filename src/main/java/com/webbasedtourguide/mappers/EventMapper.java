package com.webbasedtourguide.mappers;

import com.webbasedtourguide.dto.EventControlDTO;
import com.webbasedtourguide.dto.EventDetailsDTO;
import com.webbasedtourguide.entities.Event;
import com.webbasedtourguide.entities.TourPackage;

import java.util.stream.Collectors;

public class EventMapper {

    private EventMapper() {
    }

    public static EventDetailsDTO toDetailsDTO(Event event, TourPackage pkg) {
        EventDetailsDTO dto = new EventDetailsDTO();
        dto.setEventId(event.getId());
        dto.setEventName(event.getDisplayName());
        dto.setLocation(event.getLocation());
        dto.setFinalPrice(event.getPrice());
        if (pkg != null) {
            dto.setPkgId(pkg.getId());
            // ASSUMPTION: TourPackage has getDisplayName() — confirm against TourPackage.java,
            // adjust to whatever the real getter is (e.g. getPackageName()).
            dto.setPackageName(pkg.getDisplayName());
        }
        return dto;
    }

    public static EventControlDTO toControlDTO(Event event) {
        EventControlDTO dto = new EventControlDTO();
        dto.setEventId(event.getId());
        dto.setEventName(event.getDisplayName());
        dto.setLocation(event.getLocation());
        dto.setPrice(event.getPrice());
        dto.setStartDate(event.getStartDate());
        dto.setEndDate(event.getEndDate());
        if (event.getApplicablePackages() != null) {
            dto.setApplicablePackages(
                    event.getApplicablePackages().stream()
                            .map(TourPackage::getId)
                            .collect(Collectors.toList())
            );
        }
        return dto;
    }
}
