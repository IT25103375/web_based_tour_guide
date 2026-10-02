package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.TourPackageDTO;
import com.webbasedtourguide.entities.Destination;
import com.webbasedtourguide.entities.Discount;
import com.webbasedtourguide.entities.Event;
import com.webbasedtourguide.entities.Rating;
import com.webbasedtourguide.entities.TourGuide;
import com.webbasedtourguide.entities.TourPackage;
import com.webbasedtourguide.exceptions.PackageException;
import com.webbasedtourguide.mappers.TourPackageMapper;
import com.webbasedtourguide.repositories.DestinationRepository;
import com.webbasedtourguide.repositories.DiscountRepository;
import com.webbasedtourguide.repositories.EventRepository;
import com.webbasedtourguide.repositories.TourPackageRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;

@Service
public class TourPackageService {

    private final TourPackageRepository tourPackageRepository;
    private final TourPackageMapper tourPackageMapper;
    // To avoid circular dependency
    private final DestinationRepository destinationRepository;
    private final EventRepository eventRepository;
    private final DiscountRepository discountRepository;

    TourPackageService(TourPackageRepository tourPackageRepository, TourPackageMapper tourPackageMapper,
                       DestinationRepository destinationRepository, EventRepository eventRepository,
                       DiscountRepository discountRepository) {
        this.tourPackageRepository = tourPackageRepository;
        this.tourPackageMapper = tourPackageMapper;
        this.destinationRepository = destinationRepository;
        this.eventRepository = eventRepository;
        this.discountRepository = discountRepository;
    }

    private static List<Integer> distinct(Collection<Integer> ids) {
        return ids == null ? new ArrayList<>() : new ArrayList<>(new LinkedHashSet<>(ids));
    }

    /** Loads every package id, failing if any id does not exist. Empty/null input gives an empty list. */
    public List<TourPackage> getPackagesStrict(Collection<Integer> ids) throws PackageException {
        List<Integer> unique = distinct(ids);
        if (unique.isEmpty()) return new ArrayList<>();
        List<TourPackage> packages = new ArrayList<>((List<TourPackage>) tourPackageRepository.findAllById(unique));
        if (packages.size() != unique.size()) throw new PackageException("One or more tour packages do not exist");
        return packages;
    }

    private <T> List<T> loadAll(org.springframework.data.repository.CrudRepository<T, Integer> repo, Collection<Integer> ids, String what) throws PackageException {
        List<Integer> unique = distinct(ids);
        if (unique.isEmpty()) return new ArrayList<>();
        List<T> found = new ArrayList<>((List<T>) repo.findAllById(unique));
        if (found.size() != unique.size()) throw new PackageException("One or more " + what + " do not exist");
        return found;
    }

    /**
     * TourPackage owns the event/discount relations, so the package side must be updated for the
     * link to persist. Makes the set of packages offering this event exactly {@code packageIds}.
     */
    @Transactional
    public void setEventPackages(Event event, Collection<Integer> packageIds) throws PackageException {
        List<TourPackage> target = getPackagesStrict(packageIds);
        for (TourPackage p : new ArrayList<>(event.getApplicablePackages())) {
            if (!target.contains(p)) {
                p.removeEvent(event);
                tourPackageRepository.save(p);
            }
        }
        for (TourPackage p : target) {
            p.addEvent(event);
            tourPackageRepository.save(p);
        }
        event.setApplicablePackages(target);
    }

    @Transactional
    public void setDiscountPackages(Discount discount, Collection<Integer> packageIds) throws PackageException {
        List<TourPackage> target = getPackagesStrict(packageIds);
        for (TourPackage p : new ArrayList<>(discount.getApplicablePackages())) {
            if (!target.contains(p)) {
                p.removeDiscount(discount);
                tourPackageRepository.save(p);
            }
        }
        for (TourPackage p : target) {
            p.addDiscount(discount);
            tourPackageRepository.save(p);
        }
        discount.getApplicablePackages().clear();
        discount.getApplicablePackages().addAll(target);
    }

    /** Unlinks an event from all packages (must run before the event row is deleted). */
    @Transactional
    public void detachEvent(Event event) {
        for (TourPackage p : new ArrayList<>(event.getApplicablePackages())) {
            p.removeEvent(event);
            tourPackageRepository.save(p);
        }
        event.getApplicablePackages().clear();
    }

    @Transactional
    public void detachDiscount(Discount discount) {
        for (TourPackage p : new ArrayList<>(discount.getApplicablePackages())) {
            p.removeDiscount(discount);
            tourPackageRepository.save(p);
        }
        discount.getApplicablePackages().clear();
    }

    public List<TourPackage> getPackages(List<Integer> ids) throws PackageException {
        List<TourPackage> packages = (List<TourPackage>) tourPackageRepository.findAllById(ids);
        if (packages.isEmpty()) throw new PackageException("No matching packages");
        return packages;
    }

    private String validate(TourPackageDTO r, boolean requireName) {
        if (requireName && (r.getDisplayName() == null || r.getDisplayName().isBlank())) return "Package name is required";
        if (r.getPrice() != null && r.getPrice().signum() < 0) return "Price cannot be negative";
        if (r.getDuration() < 0) return "Duration cannot be negative";
        if (r.getCapacity() < 0) return "Capacity cannot be negative";
        return null;
    }

    @Transactional
    public BasicResponse addPackage(TourPackageDTO request) {
        String error = validate(request, true);
        if (error != null) return BasicResponse.badRequest(error);

        TourPackage tourPackage = new TourPackage();
        tourPackage.setDisplayName(request.getDisplayName());
        tourPackage.setPrice(request.getPrice());
        tourPackage.setDuration(request.getDuration());
        tourPackage.setDescription(request.getDescription());
        tourPackage.setCapacity(request.getCapacity());
        try {
            tourPackage.setOfferedDestinations(loadAll(destinationRepository, request.getOfferedDestinationIds(), "destinations"));
            tourPackage.setOfferedEvents(loadAll(eventRepository, request.getOfferedEventIds(), "events"));
            tourPackage.setOfferedDiscounts(loadAll(discountRepository, request.getOfferedDiscountIds(), "discounts"));
        } catch (PackageException e) {
            return BasicResponse.badRequest(e.getMessage());
        }
        tourPackageRepository.save(tourPackage);

        return BasicResponse.ok();
    }

    @Transactional
    public BasicResponse editPackage(TourPackageDTO request) {
        Optional<TourPackage> opPackage = tourPackageRepository.findById(request.getId());
        if (opPackage.isEmpty()) return BasicResponse.badRequest("No such tour package");

        String error = validate(request, false);
        if (error != null) return BasicResponse.badRequest(error);

        TourPackage tourPackage = opPackage.get();
        if (request.getDisplayName() != null && !request.getDisplayName().isBlank()) tourPackage.setDisplayName(request.getDisplayName());
        if (request.getPrice() != null) tourPackage.setPrice(request.getPrice());
        tourPackage.setDuration(request.getDuration());
        tourPackage.setCapacity(request.getCapacity());
        if (request.getDescription() != null) tourPackage.setDescription(request.getDescription());
        try {
            // A null list means "leave unchanged"; an empty list clears the selection
            if (request.getOfferedDestinationIds() != null)
                tourPackage.setOfferedDestinations(loadAll(destinationRepository, request.getOfferedDestinationIds(), "destinations"));
            if (request.getOfferedEventIds() != null)
                tourPackage.setOfferedEvents(loadAll(eventRepository, request.getOfferedEventIds(), "events"));
            if (request.getOfferedDiscountIds() != null)
                tourPackage.setOfferedDiscounts(loadAll(discountRepository, request.getOfferedDiscountIds(), "discounts"));
        } catch (PackageException e) {
            return BasicResponse.badRequest(e.getMessage());
        }
        tourPackageRepository.save(tourPackage);

        return BasicResponse.ok();
    }

    @Transactional
    public BasicResponse deletePackage(TourPackageDTO request) {
        tourPackageRepository.deleteById(request.getId());

        return BasicResponse.ok();
    }

    @Transactional
    public void addDestinationToPackages(Collection<Integer> packageIds, Destination destination) throws PackageException {
        List<TourPackage> packages = (List<TourPackage>) tourPackageRepository.findAllById(packageIds);
        // Cancel operation if a fetch failed
        if (packages.size() != packageIds.size()) throw new PackageException("Package Ids fetch failed");

        for (TourPackage p : packages) {
            p.addDestination(destination);
            tourPackageRepository.save(p);
        }
    }

    @Transactional
    public void removeDestinationFromPackages(Collection<Integer> packageIds, Destination destination) throws PackageException {
        List<TourPackage> packages = (List<TourPackage>) tourPackageRepository.findAllById(packageIds);
        // Cancel operation if a fetch failed
        if (packages.size() != packageIds.size()) throw new PackageException("Package Ids fetch failed");

        for (TourPackage p : packages) {
            p.removeDestination(destination);
            tourPackageRepository.save(p);
        }
    }

    public List<Destination> getDestinationsFromPackage(Integer pkgId) throws PackageException {
        TourPackage tourPackage = tourPackageRepository.findById(pkgId)
                .orElseThrow(() -> new PackageException("Cannot find package"));

        return tourPackage.getOfferedDestinations();
    }

    public List<TourPackageDTO> getAllPackages() {
        return tourPackageMapper.toDtoList((List<TourPackage>) tourPackageRepository.findAll());
    }

    @Transactional
    public void addRating(int pkg_id, Rating rating) {
        TourPackage pkg = tourPackageRepository.findById(pkg_id)
                .orElseThrow(() -> new EntityNotFoundException("Tour Package not found"));

        pkg.addRating(rating);
        tourPackageRepository.save(pkg);
    }

    public List<Rating> getRatings(int pkg_id, int count) {
        TourPackage pkg = tourPackageRepository.findById(pkg_id)
                .orElseThrow(() -> new EntityNotFoundException("Tour Package not found"));

        return pkg.getRatings(count);
    }

    public double getRatingAvg(int pkg_id) {
        TourPackage pkg = tourPackageRepository.findById(pkg_id)
                .orElseThrow(() -> new EntityNotFoundException("Tour Package not found"));

        return pkg.getRatingAvg();
    }
}
