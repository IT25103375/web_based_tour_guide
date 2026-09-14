package com.webbasedtourguide.mappers;

import com.webbasedtourguide.dto.TourPackageDTO;
import com.webbasedtourguide.entities.TourPackage;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-14T14:30:59+0530",
    comments = "version: 1.6.3, compiler: javac, environment: Java 25.0.3 (Eclipse Adoptium)"
)
@Component
public class TourPackageMapperImpl implements TourPackageMapper {

    @Autowired
    private IdResolver idResolver;

    @Override
    public TourPackageDTO toDto(TourPackage tourPackage) {
        if ( tourPackage == null ) {
            return null;
        }

        TourPackageDTO tourPackageDTO = new TourPackageDTO();

        tourPackageDTO.setOfferedDestinationIds( idResolver.destinationsToIds( tourPackage.getOfferedDestinations() ) );
        tourPackageDTO.setId( tourPackage.getId() );
        tourPackageDTO.setDisplayName( tourPackage.getDisplayName() );
        tourPackageDTO.setPrice( tourPackage.getPrice() );

        return tourPackageDTO;
    }

    @Override
    public TourPackage toEntity(TourPackageDTO dto) {
        if ( dto == null ) {
            return null;
        }

        TourPackage tourPackage = new TourPackage();

        tourPackage.setOfferedDestinations( idResolver.idsToDestinations( dto.getOfferedDestinationIds() ) );
        tourPackage.setId( dto.getId() );
        tourPackage.setDisplayName( dto.getDisplayName() );
        tourPackage.setPrice( dto.getPrice() );

        return tourPackage;
    }

    @Override
    public List<TourPackageDTO> toDtoList(List<TourPackage> tourPackages) {
        if ( tourPackages == null ) {
            return null;
        }

        List<TourPackageDTO> list = new ArrayList<TourPackageDTO>( tourPackages.size() );
        for ( TourPackage tourPackage : tourPackages ) {
            list.add( toDto( tourPackage ) );
        }

        return list;
    }
}
