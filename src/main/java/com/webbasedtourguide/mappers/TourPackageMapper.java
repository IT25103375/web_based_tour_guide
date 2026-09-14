package com.webbasedtourguide.mappers;

import com.webbasedtourguide.dto.TourPackageDTO;
import com.webbasedtourguide.entities.TourPackage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = IdResolver.class)
public interface TourPackageMapper {

    @Mapping(target = "offeredDestinationIds", source = "offeredDestinations", qualifiedByName = "destinationsToIds")
    TourPackageDTO toDto(TourPackage tourPackage);

    @Mapping(target = "offeredDestinations", source = "offeredDestinationIds", qualifiedByName = "idsToDestinations")
    TourPackage toEntity(TourPackageDTO dto);

    List<TourPackageDTO> toDtoList(List<TourPackage> tourPackages);
}