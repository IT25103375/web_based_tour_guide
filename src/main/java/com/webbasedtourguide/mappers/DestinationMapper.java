package com.webbasedtourguide.mappers;

import com.webbasedtourguide.dto.DestinationDTO;
import com.webbasedtourguide.entities.Destination;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = com.webbasedtourguide.mappers.IdResolver.class)
public interface DestinationMapper {

    @Mapping(target = "offeredPackageIds", source = "offeredPackages", qualifiedByName = "packagesToIds")
    DestinationDTO toDto(Destination destination);

    @Mapping(target = "offeredPackages", source = "offeredPackageIds", qualifiedByName = "idsToPackages")
    Destination toEntity(DestinationDTO dto);
}