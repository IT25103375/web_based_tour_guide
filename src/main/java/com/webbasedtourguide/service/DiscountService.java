package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.DiscountDTO;
import com.webbasedtourguide.entities.CouponCode;
import com.webbasedtourguide.entities.Discount;
import com.webbasedtourguide.entities.TimedDiscount;
import com.webbasedtourguide.enums.DiscountPriceType;
import com.webbasedtourguide.enums.DiscountTimeType;
import com.webbasedtourguide.exceptions.DiscountException;
import com.webbasedtourguide.mappers.DiscountMapper;
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
    private final DiscountMapper discountMapper;

    DiscountService(DiscountRepository discountRepository, DiscountMapper discountMapper) {
        this.discountRepository = discountRepository;
        this.discountMapper = discountMapper;
    }

    public Discount getDiscount(String couponCode, Integer pkgId) {
        if (couponCode != null && !couponCode.isEmpty()) {
            return (Discount) discountRepository.getCouponCodeForPackage(couponCode, pkgId).orElseThrow(
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
            throw new com.webbasedtourguide.service.DiscountException("Invalid discount");
        if (discount.getStartDate().isAfter(Instant.now()) ||
                discount.getEndDate().isBefore(Instant.now()))
            throw new DiscountException("Discount expired");

        if (discount.getDiscountPriceType() == DiscountPriceType.FIXED) {
            return orgPrice.subtract(discount.getFixed()).max(BigDecimal.ZERO);
        }

        else if (discount.getDiscountPriceType() == DiscountPriceType.PERCENTAGE) {
            return orgPrice.subtract(orgPrice.multiply(
                    (discount.getPercentage().divide(BigDecimal.valueOf(100))))
                    .max(BigDecimal.ZERO)).max(BigDecimal.ZERO);
        }

        throw new DiscountException("Unknown error");
    }

    private static final BigDecimal ONE_HUNDRED = BigDecimal.valueOf(100);

    public List<DiscountDTO> getAllDiscounts() {
        return discountMapper.toDtoList((List<Discount>) discountRepository.findAll());
    }

    @Transactional
    public BasicResponse addDiscount(DiscountDTO request) {

        if (request.getDiscountTimeType() == DiscountTimeType.TIMED)
            discountRepository.save(discountMapper.toTimedDiscount(request));
        else if (request.getDiscountTimeType() == DiscountTimeType.CODE)
            discountRepository.save(discountMapper.toCouponCode(request));

        return BasicResponse.ok();
    }

    @Transactional
    public BasicResponse editDiscount(DiscountDTO request) {
        Discount discount = discountRepository.findById(request.getId())
                .orElseThrow(() -> new DiscountException("No such discount"));

        if (discount.getDiscountTimeType() == DiscountTimeType.CODE) {
            if (request.getCouponCode() == null || request.getCouponCode().isBlank())
                return BasicResponse.badRequest("Invalid code");

            discount.setCouponCode(request.getCouponCode());
        }
        else if (discount.getDiscountTimeType() == DiscountTimeType.INVALID)
            return BasicResponse.badRequest("Invalid discount");

        discount.setMinAmount(request.getMinAmount());
        if (discount.getDiscountPriceType() == DiscountPriceType.FIXED)
            discount.setFixed(request.getFixed());
        else if (discount.getDiscountPriceType() == DiscountPriceType.PERCENTAGE)
            discount.setPercentage(request.getPercentage());
        else
            return BasicResponse.badRequest("Invalid discount");

        discountRepository.save(discount);
        return BasicResponse.ok();
    }

    @Transactional
    public BasicResponse deleteDiscount(Integer id) {
        discountRepository.deleteById(id);
        return BasicResponse.ok();
    }
}