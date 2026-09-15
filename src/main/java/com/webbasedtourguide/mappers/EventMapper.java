package com.webbasedtourguide.mappers;

import com.webbasedtourguide.dto.EventDetailsDTO;
import com.webbasedtourguide.dto.TourPackageDTO;
import com.webbasedtourguide.entities.Event;
import com.webbasedtourguide.entities.TourPackage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = IdResolver.class)
public interface EventMapper {

    @Mapping(target = "eventId", source = "id")
//    @Mapping(target = "pkgId", source = "tourPackage.pkgId")
//    @Mapping(target = "packageName", source = "tourPackage.displayName")
    EventDetailsDTO toDto(Event event);

//    @Mapping(target = "offeredDestinations", source = "offeredDestinationIds")
//    Event toEntity(EventDetailsDTO dto);

    List<EventDetailsDTO> toDtoList(List<Event> events);
}