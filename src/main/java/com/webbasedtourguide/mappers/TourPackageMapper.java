package com.webbasedtourguide.mappers;

import com.webbasedtourguide.dto.TourPackageDTO;
import com.webbasedtourguide.entities.TourPackage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = IdResolver.class)
public interface TourPackageMapper {

    @Mapping(target = "avgRating", expression = "java(tourPackage.getRatingAvg())")
    @Mapping(target = "offeredDestinationIds", source = "offeredDestinations", qualifiedByName = "destinationsToIds")
    @Mapping(target = "offeredDestinationNames", source = "offeredDestinations", qualifiedByName = "destinationsToNames")
    @Mapping(target = "offeredEventIds", source = "offeredEvents", qualifiedByName = "eventsToIds")
    @Mapping(target = "offeredEventNames", source = "offeredEvents", qualifiedByName = "eventsToNames")
    @Mapping(target = "offeredDiscountIds", source = "offeredDiscounts", qualifiedByName = "discountsToIds")
    TourPackageDTO toDto(TourPackage tourPackage);

    @Mapping(target = "offeredDestinations", source = "offeredDestinationIds", qualifiedByName = "idsToDestinations")
    @Mapping(target = "offeredEvents", source = "offeredEventIds", qualifiedByName = "idsToEvents")
    @Mapping(target = "offeredDiscounts", source = "offeredDiscountIds", qualifiedByName = "idsToDiscounts")
    TourPackage toEntity(TourPackageDTO dto);

    List<TourPackageDTO> toDtoList(List<TourPackage> tourPackages);
}