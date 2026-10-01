package com.webbasedtourguide.mappers;

import com.webbasedtourguide.dto.BookingDetailsDTO;
import com.webbasedtourguide.dto.TicketDTO;
import com.webbasedtourguide.dto.UserMessageDTO;
import com.webbasedtourguide.entities.Ticket;
import com.webbasedtourguide.entities.TourBooking;
import com.webbasedtourguide.entities.UserMessage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = IdResolver.class)
public interface ServiceMapper {

    @Mapping(target = "sender", ignore = true)
    UserMessage toEntity(UserMessageDTO dto);

    @Mapping(target = "sender", source = "sender.username")
    UserMessageDTO toDto(UserMessage entity);

    Ticket toEntity(TicketDTO dto);

    TicketDTO toDto(Ticket entity);

    List<UserMessageDTO> toDtoList(List<UserMessage> userMessages);
}