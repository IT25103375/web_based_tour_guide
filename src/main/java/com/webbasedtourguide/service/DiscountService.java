package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.DiscountAdminDTO;
import com.webbasedtourguide.entities.CouponCode;
import com.webbasedtourguide.entities.Discount;
import com.webbasedtourguide.entities.TimedDiscount;
import com.webbasedtourguide.enums.DiscountPriceType;
import com.webbasedtourguide.enums.DiscountTimeType;
import com.webbasedtourguide.exceptions.DiscountException;
import com.webbasedtourguide.repositories.DiscountRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class DiscountService {

    private final DiscountRepository discountRepository;

    DiscountService(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    public Discount getDiscount(String couponCode, Integer pkgId) {
        if (couponCode != null && !couponCode.isEmpty()) {
            return discountRepository.getCouponCodeForPackage(couponCode, pkgId).orElseThrow(
                    () -> new EntityNotFoundException("Invalid discount!"));
        }
        else {
            List<TimedDiscount> discounts = discountRepository.getAvailableTimedDiscounts(pkgId);

            if (!discounts.isEmpty())
                // TODO: Handle multiple discounts existing
                return discounts.getFirst();
        }

        return null;
    }

    public BigDecimal applyDiscount(BigDecimal orgPrice, Discount discount) {

        if (discount.getDiscountPriceType() == DiscountPriceType.INVALID ||
                discount.getDiscountTimeType() == DiscountTimeType.INVALID)
            throw new DiscountException("Invalid discount");
        if (discount.getStartDate().isAfter(Instant.now()) ||
                discount.getEndDate().isBefore(Instant.now()))
            throw new DiscountException("Discount expired");

        if (discount.getDiscountPriceType() == DiscountPriceType.FIXED) {
            return orgPrice.subtract(discount.getFixed()).max(BigDecimal.ZERO);
        }

        else if (discount.getDiscountPriceType() == DiscountPriceType.PERCENTAGE) {
            return orgPrice.subtract(orgPrice.multiply(discount.getPercentage()))
                    .max(BigDecimal.ZERO);
        }

        throw new DiscountException("Unknown error");
    }

    // --- Admin coupon-code CRUD (used by the admin panel's Discounts tab) ---

    private static final BigDecimal ONE_HUNDRED = BigDecimal.valueOf(100);

    public List<DiscountAdminDTO> getAllDiscounts() {
        return StreamSupport.stream(discountRepository.findAll().spliterator(), false)
                .map(this::toAdminDto)
                .collect(Collectors.toList());
    }

    private DiscountAdminDTO toAdminDto(Discount d) {
        DiscountAdminDTO dto = new DiscountAdminDTO();
        dto.setId(d.getId());
        dto.setCode(d.getCouponCode());
        dto.setDescription(d.getDescription());
        dto.setPercentage(d.getPercentage() == null ? null : d.getPercentage().multiply(ONE_HUNDRED));
        dto.setMinAmount(d.getMinAmount());
        dto.setActive(d.getEndDate() != null && d.getEndDate().isAfter(Instant.now()));
        return dto;
    }

    @Transactional
    public BasicResponse addDiscount(DiscountAdminDTO request) {
        CouponCode coupon = new CouponCode();
        coupon.setCouponCode(request.getCode());
        coupon.setDescription(request.getDescription());
        coupon.setMinAmount(request.getMinAmount());
        coupon.setDiscountPriceType(DiscountPriceType.PERCENTAGE);
        if (request.getPercentage() != null) coupon.setPercentage(request.getPercentage().divide(ONE_HUNDRED));
        coupon.setStartDate(Instant.now());
        coupon.setEndDate(request.isActive() ? Instant.now().plus(3650, ChronoUnit.DAYS) : Instant.now().minusSeconds(1));
        discountRepository.save(coupon);
        return BasicResponse.ok();
    }

    @Transactional
    public BasicResponse editDiscount(DiscountAdminDTO request) {
        Discount discount = discountRepository.findById(request.getId())
                .orElseThrow(() -> new DiscountException("No such discount"));

        if (request.getCode() != null && !request.getCode().isBlank()) discount.setCouponCode(request.getCode());
        if (request.getDescription() != null) discount.setDescription(request.getDescription());
        if (request.getMinAmount() != null) discount.setMinAmount(request.getMinAmount());
        if (request.getPercentage() != null) discount.setPercentage(request.getPercentage().divide(ONE_HUNDRED));
        discount.setEndDate(request.isActive() ? Instant.now().plus(3650, ChronoUnit.DAYS) : Instant.now().minusSeconds(1));
        discountRepository.save(discount);
        return BasicResponse.ok();
    }

    @Transactional
    public BasicResponse deleteDiscount(Integer id) {
        discountRepository.deleteById(id);
        return BasicResponse.ok();
    }
}