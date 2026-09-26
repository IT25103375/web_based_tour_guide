package com.webbasedtourguide.mappers;

import com.webbasedtourguide.dto.DestinationDTO;
import com.webbasedtourguide.dto.DiscountDTO;
import com.webbasedtourguide.entities.CouponCode;
import com.webbasedtourguide.entities.Destination;
import com.webbasedtourguide.entities.Discount;
import com.webbasedtourguide.entities.TimedDiscount;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = IdResolver.class)
public interface DiscountMapper {

    @Mapping(target = "applicablePackagesIds", source = "applicablePackages", qualifiedByName = "packagesToIds")
    DiscountDTO toDto(Discount discount);

    @Mapping(target = "applicablePackages", source = "applicablePackagesIds", qualifiedByName = "idsToPackages")
    Discount toEntity(DiscountDTO dto);

    @Mapping(target = "applicablePackages", source = "applicablePackagesIds", qualifiedByName = "idsToPackages")
    CouponCode toCouponCode(DiscountDTO dto);

    @Mapping(target = "applicablePackages", source = "applicablePackagesIds", qualifiedByName = "idsToPackages")
    TimedDiscount toTimedDiscount(DiscountDTO dto);

    List<DiscountDTO> toDtoList(List<Discount> discounts);
}