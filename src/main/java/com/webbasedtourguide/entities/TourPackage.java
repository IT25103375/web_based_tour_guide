
package com.webbasedtourguide.entities;

import java.util.ArrayList;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
public class TourPackage {

    @Id
    @GeneratedValue
    private Integer id;

    private String displayName;
    private BigDecimal price;

    @ManyToMany
    private List<Destination> offeredDestinations;

    @ManyToMany
    private List<Event> offeredEvents;

    @ManyToMany
    @JoinTable(
            name = "tour_package_discount",
            joinColumns = @JoinColumn(name = "tour_package_id"),
            inverseJoinColumns = @JoinColumn(name = "discount_id"))
    private List<Discount> offeredDiscounts = new ArrayList<>();



    public List<Discount> getOfferedDiscounts() {
        return offeredDiscounts;
    }

    /** Keeps BOTH sides of the many-to-many in sync. */
    public void addDiscount(Discount discount) {
        if (!offeredDiscounts.contains(discount)) {
            offeredDiscounts.add(discount);
            discount.getApplicablePackages().add(this);
        }
    }

    public void removeDiscount(Discount discount) {
        offeredDiscounts.remove(discount);
        discount.getApplicablePackages().remove(this);
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public List<Destination> getOfferedDestinations() {
        return offeredDestinations;
    }

    public void setOfferedDestinations(List<Destination> offeredDestinations) {
        this.offeredDestinations = offeredDestinations;
    }

    public void addDestination(Destination destination) {
        this.offeredDestinations.add(destination);
    }

    public void removeDestination(Destination o) {
        this.offeredDestinations.remove(o);
    }
}
