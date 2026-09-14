package com.webbasedtourguide.mappers;

import com.webbasedtourguide.dto.DestinationDTO;
import com.webbasedtourguide.entities.Destination;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-14T14:30:59+0530",
    comments = "version: 1.6.3, compiler: javac, environment: Java 25.0.3 (Eclipse Adoptium)"
)
@Component
public class DestinationMapperImpl implements DestinationMapper {

    @Autowired
    private IdResolver idResolver;

    @Override
    public DestinationDTO toDto(Destination destination) {
        if ( destination == null ) {
            return null;
        }

        DestinationDTO destinationDTO = new DestinationDTO();

        destinationDTO.setOfferedPackageIds( idResolver.packagesToIds( destination.getOfferedPackages() ) );
        destinationDTO.setId( destination.getId() );
        destinationDTO.setDisplayName( destination.getDisplayName() );
        destinationDTO.setLocation( destination.getLocation() );

        return destinationDTO;
    }

    @Override
    public Destination toEntity(DestinationDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Destination destination = new Destination();

        destination.setOfferedPackages( idResolver.idsToPackages( dto.getOfferedPackageIds() ) );
        destination.setId( dto.getId() );
        destination.setDisplayName( dto.getDisplayName() );
        destination.setLocation( dto.getLocation() );

        return destination;
    }
}
