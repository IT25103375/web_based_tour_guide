package com.webbasedtourguide.config;

import com.webbasedtourguide.entities.CouponCode;
import com.webbasedtourguide.entities.Discount;
import com.webbasedtourguide.entities.TimedDiscount;
import com.webbasedtourguide.entities.TourPackage;
import com.webbasedtourguide.enums.DiscountPriceType;
import com.webbasedtourguide.repositories.DiscountRepository;
import com.webbasedtourguide.repositories.TourPackageRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Inserts demo discounts on startup when the discount table is empty.
 * Turn off with  app.seed-discounts=false  in application.properties.
 */
@Component
@ConditionalOnProperty(name = "app.seed-discounts", havingValue = "true", matchIfMissing = true)
public class DiscountDataSeeder implements CommandLineRunner {

    private final DiscountRepository discountRepository;
    private final TourPackageRepository tourPackageRepository;

    public DiscountDataSeeder(DiscountRepository discountRepository,
                              TourPackageRepository tourPackageRepository) {
        this.discountRepository = discountRepository;
        this.tourPackageRepository = tourPackageRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (discountRepository.count() > 0) return;

        List<TourPackage> packages = new ArrayList<>();
        tourPackageRepository.findAll().forEach(packages::add);

        if (packages.isEmpty()) {   // only so the discount module can be tested alone
            packages.add(samplePackage("[Sample] Kandy Cultural Day Tour", "15000.00"));
            packages.add(samplePackage("[Sample] Galle Fort & Beach Tour", "22000.00"));
            tourPackageRepository.saveAll(packages);
        }

        Instant now = Instant.now();

        TimedDiscount avurudu = new TimedDiscount();
        avurudu.setName("Seasonal Offer");
        avurudu.setDescription("10% off selected packages");
        avurudu.setDiscountPriceType(DiscountPriceType.PERCENTAGE);
        avurudu.setPercentage(new BigDecimal("10.00"));
        avurudu.setStartDate(now);
        avurudu.setEndDate(now.plus(30, ChronoUnit.DAYS));
        save(avurudu, packages);

        CouponCode welcome = new CouponCode();
        welcome.setName("Welcome Coupon");
        welcome.setDescription("LKR 1,500 off for new tourists");
        welcome.setCouponCode("WELCOME15");
        welcome.setDiscountPriceType(DiscountPriceType.FIXED);
        welcome.setFixed(new BigDecimal("1500.00"));
        welcome.setUsageLimit(100);
        welcome.setMinAmount(new BigDecimal("5000.00"));
        welcome.setStartDate(now);
        welcome.setEndDate(now.plus(60, ChronoUnit.DAYS));
        save(welcome, packages);
    }

    private void save(Discount d, List<TourPackage> packages) {
        Discount saved = discountRepository.save(d);
        packages.forEach(p -> p.addDiscount(saved));
        tourPackageRepository.saveAll(packages);
    }

    private TourPackage samplePackage(String name, String price) {
        TourPackage p = new TourPackage();
        p.setDisplayName(name);
        p.setPrice(new BigDecimal(price));
        return p;
    }
}
