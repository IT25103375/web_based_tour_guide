package com.webbasedtourguide.mappers;

import com.webbasedtourguide.dto.DiscountRequestDTO;
import com.webbasedtourguide.dto.DiscountResponseDTO;
import com.webbasedtourguide.dto.PackageSummaryDTO;
import com.webbasedtourguide.entities.CouponCode;
import com.webbasedtourguide.entities.Discount;
import com.webbasedtourguide.entities.TimedDiscount;
import com.webbasedtourguide.entities.TourPackage;
import com.webbasedtourguide.enums.DiscountPriceType;
import com.webbasedtourguide.enums.DiscountTimeType;
import com.webbasedtourguide.exceptions.DiscountException;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Hand-written mapper (instead of MapStruct) because we must create a
 * different subclass (TimedDiscount / CouponCode) depending on the request.
 */
@Component
public class DiscountMapper {

    /** CREATE: DTO -> new entity of the correct subclass. */
    public Discount toNewEntity(DiscountRequestDTO dto) {
        Discount discount = switch (dto.getDiscountType()) {
            case TIMED -> new TimedDiscount();
            case CODE -> new CouponCode();
            case INVALID -> throw new DiscountException("Invalid discount type");
        };
        updateEntity(discount, dto);
        return discount;
    }

    /** UPDATE: copy editable fields (NOT id, type or packages) into an existing entity. */
    public void updateEntity(Discount discount, DiscountRequestDTO dto) {
        discount.setName(dto.getName());
        discount.setDescription(dto.getDescription());
        discount.setDiscountPriceType(dto.getPriceType());

        if (dto.getPriceType() == DiscountPriceType.PERCENTAGE) {
            discount.setPercentage(dto.getPercentage());
            discount.setFixed(null);
        } else {
            discount.setFixed(dto.getFixedAmount());
            discount.setPercentage(null);
        }

        discount.setMinAmount(dto.getMinAmount());
        discount.setStartDate(dto.getStartDate());
        discount.setEndDate(dto.getEndDate());

        if (discount.getDiscountTimeType() == DiscountTimeType.CODE) {
            discount.setCouponCode(dto.getCouponCode());
            discount.setUsageLimit(dto.getUsageLimit());
        } else {
            discount.setCouponCode(null);
            discount.setUsageLimit(null);
        }

        discount.setActive(dto.getActive() == null || dto.getActive());
    }

    /** Entity -> response DTO. */
    public DiscountResponseDTO toResponse(Discount d, long timesUsed) {
        DiscountResponseDTO r = new DiscountResponseDTO();
        r.setId(d.getId());
        r.setName(d.getName());
        r.setDescription(d.getDescription());
        r.setDiscountType(d.getDiscountTimeType());
        r.setPriceType(d.getDiscountPriceType());
        r.setPercentage(d.getPercentage());
        r.setFixedAmount(d.getFixed());
        r.setCouponCode(d.getCouponCode());
        r.setStartDate(d.getStartDate());
        r.setEndDate(d.getEndDate());
        r.setMinAmount(d.getMinAmount());
        r.setUsageLimit(d.getUsageLimit());
        r.setTimesUsed(timesUsed);
        r.setActive(d.isActive());
        r.setStatus(resolveStatus(d));
        r.setPackages(toPackageSummaries(d.getApplicablePackages()));
        r.setCreatedAt(d.getCreatedAt());
        r.setUpdatedAt(d.getUpdatedAt());
        return r;
    }

    public List<PackageSummaryDTO> toPackageSummaries(List<TourPackage> packages) {
        if (packages == null) return List.of();
        return packages.stream()
                .map(p -> new PackageSummaryDTO(p.getId(), p.getDisplayName(), p.getPrice()))
                .toList();
    }

    public String resolveStatus(Discount d) {
        Instant now = Instant.now();
        if (!d.isActive()) return "DISABLED";
        if (d.getStartDate().isAfter(now)) return "SCHEDULED";
        if (d.getEndDate().isBefore(now)) return "EXPIRED";
        return "ACTIVE";
    }

    /** "15% OFF" or "LKR 2,000.00 OFF" */
    public String toLabel(Discount d) {
        if (d.getDiscountPriceType() == DiscountPriceType.PERCENTAGE) {
            return d.getPercentage().stripTrailingZeros().toPlainString() + "% OFF";
        }
        BigDecimal fixed = d.getFixed() == null ? BigDecimal.ZERO : d.getFixed();
        return String.format("LKR %,.2f OFF", fixed);
    }
}
