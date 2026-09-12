package com.webbasedtourguide.service;

import com.webbasedtourguide.entities.Discount;
import com.webbasedtourguide.entities.TimedDiscount;
import com.webbasedtourguide.enums.DiscountPriceType;
import com.webbasedtourguide.enums.DiscountTimeType;
import com.webbasedtourguide.exceptions.DiscountException;
import com.webbasedtourguide.repositories.DiscountRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
class DiscountService {

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
}
