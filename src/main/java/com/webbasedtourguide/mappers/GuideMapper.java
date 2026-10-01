package com.webbasedtourguide.mappers;

import com.webbasedtourguide.dto.TourGuideDTO;
import com.webbasedtourguide.dto.TourPackageDTO;
import com.webbasedtourguide.entities.TourGuide;
import com.webbasedtourguide.entities.TourPackage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = IdResolver.class)
public interface GuideMapper {

    @Mapping(target = "avgRating", source = "java(tourGuide.getRatingAvg())")
    TourGuideDTO toDto(TourGuide tourGuide);

//    TourGuide toEntity(TourGuideDTO dto);
}