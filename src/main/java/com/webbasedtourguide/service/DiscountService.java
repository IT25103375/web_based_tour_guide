package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.DiscountDTO;
import com.webbasedtourguide.entities.CouponCode;
import com.webbasedtourguide.entities.Discount;
import com.webbasedtourguide.entities.TimedDiscount;
import com.webbasedtourguide.enums.DiscountPriceType;
import com.webbasedtourguide.enums.DiscountTimeType;
import com.webbasedtourguide.exceptions.DiscountException;
import com.webbasedtourguide.exceptions.PackageException;
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

    private final TourPackageService tourPackageService;

    DiscountService(DiscountRepository discountRepository, DiscountMapper discountMapper, TourPackageService tourPackageService) {
        this.discountRepository = discountRepository;
        this.discountMapper = discountMapper;
        this.tourPackageService = tourPackageService;
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

    /** Shared field checks; returns an error message or null when valid. */
    private String validate(DiscountDTO r, DiscountTimeType timeType, DiscountPriceType priceType, Integer excludeId) {
        if (timeType == null || timeType == DiscountTimeType.INVALID) return "Invalid discount type";
        if (priceType == null || priceType == DiscountPriceType.INVALID) return "Invalid discount value type";

        if (priceType == DiscountPriceType.PERCENTAGE) {
            if (r.getPercentage() == null || r.getPercentage().signum() <= 0 || r.getPercentage().compareTo(ONE_HUNDRED) > 0)
                return "Percentage must be between 0 and 100";
        } else if (r.getFixed() == null || r.getFixed().signum() <= 0) {
            return "Fixed amount must be greater than 0";
        }
        if (r.getMinAmount() != null && r.getMinAmount().signum() < 0) return "Minimum amount cannot be negative";
        if (r.getStartDate() == null || r.getEndDate() == null) return "Start and end dates are required";
        if (r.getEndDate().isBefore(r.getStartDate())) return "End date cannot be before start date";

        if (timeType == DiscountTimeType.CODE) {
            if (r.getCouponCode() == null || r.getCouponCode().isBlank()) return "Coupon code is required";
            if (discountRepository.couponCodeExists(r.getCouponCode().trim(), excludeId)) return "Coupon code already exists";
        }
        return null;
    }

    @Transactional
    public BasicResponse addDiscount(DiscountDTO request) {

        String error = validate(request, request.getDiscountTimeType(), request.getDiscountPriceType(), null);
        if (error != null) return BasicResponse.badRequest(error);
        if (request.getApplicablePackagesIds() == null || request.getApplicablePackagesIds().isEmpty())
            return BasicResponse.badRequest("Select at least one tour package");

        Discount discount = request.getDiscountTimeType() == DiscountTimeType.TIMED
                ? discountMapper.toTimedDiscount(request)
                : discountMapper.toCouponCode(request);
        discount.setId(null);
        if (discount.getDiscountTimeType() == DiscountTimeType.TIMED) discount.setCouponCode(null);
        else discount.setCouponCode(request.getCouponCode().trim());
        if (discount.getMinAmount() == null) discount.setMinAmount(BigDecimal.ZERO);

        try {
            discountRepository.save(discount);
            // Packages own the relation, so link from their side (validates that every package exists)
            tourPackageService.setDiscountPackages(discount, request.getApplicablePackagesIds());
        } catch (PackageException e) {
            // Roll back the whole save, otherwise a discount with no packages would be left behind
            org.springframework.transaction.interceptor.TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return BasicResponse.badRequest(e.getMessage());
        }

        return BasicResponse.ok();
    }

    @Transactional
    public BasicResponse editDiscount(DiscountDTO request) {
        Discount discount = discountRepository.findById(request.getId())
                .orElseThrow(() -> new DiscountException("No such discount"));

        // The time type (coupon vs timed) is fixed at creation; the price type may be changed
        DiscountPriceType priceType = request.getDiscountPriceType() != null
                ? request.getDiscountPriceType() : discount.getDiscountPriceType();
        String error = validate(request, discount.getDiscountTimeType(), priceType, discount.getId());
        if (error != null) return BasicResponse.badRequest(error);
        if (request.getApplicablePackagesIds() != null && request.getApplicablePackagesIds().isEmpty())
            return BasicResponse.badRequest("Select at least one tour package");

        if (discount.getDiscountTimeType() == DiscountTimeType.CODE)
            discount.setCouponCode(request.getCouponCode().trim());

        discount.setDiscountPriceType(priceType);
        discount.setMinAmount(request.getMinAmount() != null ? request.getMinAmount() : BigDecimal.ZERO);
        discount.setStartDate(request.getStartDate());
        discount.setEndDate(request.getEndDate());
        if (priceType == DiscountPriceType.FIXED) {
            discount.setFixed(request.getFixed());
            discount.setPercentage(null);
        } else {
            discount.setPercentage(request.getPercentage());
            discount.setFixed(null);
        }

        try {
            if (request.getApplicablePackagesIds() != null)
                tourPackageService.setDiscountPackages(discount, request.getApplicablePackagesIds());
        } catch (PackageException e) {
            org.springframework.transaction.interceptor.TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return BasicResponse.badRequest(e.getMessage());
        }

        discountRepository.save(discount);
        return BasicResponse.ok();
    }

    @Transactional
    public BasicResponse deleteDiscount(Integer id) {
        Discount discount = discountRepository.findById(id).orElse(null);
        if (discount == null) return BasicResponse.badRequest("No such discount");
        tourPackageService.detachDiscount(discount);
        discountRepository.delete(discount);
        return BasicResponse.ok();
    }
}