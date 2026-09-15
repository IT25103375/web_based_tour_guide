package com.webbasedtourguide.mappers;

import com.webbasedtourguide.dto.BookingDetailsDTO;
import com.webbasedtourguide.dto.EventDetailsDTO;
import com.webbasedtourguide.entities.Event;
import com.webbasedtourguide.entities.TourBooking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = IdResolver.class)
public interface BookingMapper {

    @Mapping(target = "bookingId", source = "id")
    @Mapping(target = "bookerId", source = "booker.id")
    @Mapping(target = "packageId", source = "tourPackage.id")
    @Mapping(target = "guideId", source = "guide.id")
    @Mapping(target = "packageName", source = "tourPackage.displayName")
    @Mapping(target = "guideName", source = "guide.name")
    BookingDetailsDTO toDto(TourBooking tourBooking);

    List<BookingDetailsDTO> toDtoList(List<TourBooking> tourBookings);
}