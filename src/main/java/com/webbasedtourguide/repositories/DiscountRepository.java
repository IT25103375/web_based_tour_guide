package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.CouponCode;
import com.webbasedtourguide.entities.Discount;
import com.webbasedtourguide.entities.TimedDiscount;
import com.webbasedtourguide.enums.BookingStatus;
import com.webbasedtourguide.enums.DiscountTimeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface DiscountRepository extends JpaRepository<Discount, Integer> {

    // ---------- derived queries (Spring writes the SQL from the method name) ----------

    List<Discount> findAllByOrderByIdDesc();

    List<Discount> findByDiscountTimeTypeOrderByIdDesc(DiscountTimeType type);

    boolean existsByCouponCodeIgnoreCase(String couponCode);

    boolean existsByCouponCodeIgnoreCaseAndIdNot(String couponCode, Integer id);

    // ---------- custom JPQL queries ----------

    /** Coupon that exists AND is attached to the given package. */
    @Query("SELECT c FROM CouponCode c JOIN c.applicablePackages p " +
            "WHERE p.id = :pkgId AND UPPER(c.couponCode) = UPPER(:code)")
    Optional<CouponCode> findCouponForPackage(@Param("code") String code,
                                              @Param("pkgId") Integer pkgId);

    /** Coupon by code only (used to give a clearer error message). */
    @Query("SELECT c FROM CouponCode c WHERE UPPER(c.couponCode) = UPPER(:code)")
    Optional<CouponCode> findCouponByCode(@Param("code") String code);

    /** Timed discounts on a package that are active and inside their date range right now. */
    @Query("SELECT t FROM TimedDiscount t JOIN t.applicablePackages p " +
            "WHERE p.id = :pkgId AND t.active = true " +
            "AND t.startDate <= :now AND t.endDate >= :now")
    List<TimedDiscount> findActiveTimedDiscountsForPackage(@Param("pkgId") Integer pkgId,
                                                           @Param("now") Instant now);

    /** How many non-cancelled bookings used this discount (for usage limit + safe delete). */
    @Query("SELECT COUNT(b) FROM TourBooking b " +
            "WHERE b.discount.id = :discountId AND b.status <> :excluded")
    long countBookingsUsingDiscount(@Param("discountId") Integer discountId,
                                    @Param("excluded") BookingStatus excluded);

    /** Any booking at all (even cancelled) -> row cannot be deleted because of the foreign key. */
    @Query("SELECT COUNT(b) > 0 FROM TourBooking b WHERE b.discount.id = :discountId")
    boolean isReferencedByBookings(@Param("discountId") Integer discountId);
}