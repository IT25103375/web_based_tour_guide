package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.Discount;
import com.webbasedtourguide.entities.TimedDiscount;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface DiscountRepository extends CrudRepository<Discount, Integer> {

    // TODO: Find a way to handle multiple discounts existing together

    @Query("SELECT d FROM Discount d WHERE d.id = :id AND TYPE(d) = TimedDiscount")
    Optional<TimedDiscount> getTimedDiscountById(Integer id);

    @Query("SELECT COUNT(d) > 0 FROM CouponCode d WHERE UPPER(d.couponCode) = UPPER(:code) AND (:excludeId IS NULL OR d.id <> :excludeId)")
    boolean couponCodeExists(String code, Integer excludeId);

    @Query("SELECT d FROM Discount d JOIN d.applicablePackages p " +
            "WHERE p.id = :pkgId AND TYPE(d) = CouponCode AND d.couponCode = :code")
    Optional<Discount> getCouponCodeForPackage(String code, Integer pkgId);

    @Query("SELECT d FROM Discount d JOIN d.applicablePackages p " +
            "WHERE p.id = :pkgId AND TYPE(d) = TimedDiscount")
    List<TimedDiscount> getAvailableTimedDiscounts(Integer pkgId);
}