package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.TourPackageDTO;
import com.webbasedtourguide.entities.Destination;
import com.webbasedtourguide.entities.TourPackage;
import com.webbasedtourguide.exceptions.PackageException;
import com.webbasedtourguide.mappers.TourPackageMapper;
import com.webbasedtourguide.repositories.DestinationRepository;
import com.webbasedtourguide.repositories.TourPackageRepository;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class TourPackageService {

    private final TourPackageRepository tourPackageRepository;
    private final TourPackageMapper tourPackageMapper;
    // To avoid circular dependency
    private final DestinationRepository destinationRepository;

    TourPackageService(TourPackageRepository tourPackageRepository, TourPackageMapper tourPackageMapper, DestinationRepository destinationRepository) {
        this.tourPackageRepository = tourPackageRepository;
        this.tourPackageMapper = tourPackageMapper;
        this.destinationRepository = destinationRepository;
    }

    public List<TourPackage> getPackages(List<Integer> ids) throws PackageException {
        List<TourPackage> packages = (List<TourPackage>) tourPackageRepository.findAllById(ids);
        if (packages.isEmpty()) throw new PackageException("No matching packages");
        return packages;
    }

    public BasicResponse addPackage(TourPackageDTO request) {
        TourPackage tourPackage = new TourPackage();
        tourPackage.setDisplayName(request.getDisplayName());
        tourPackage.setPrice(request.getPrice());
        tourPackage.setOfferedDestinations((List<Destination>) destinationRepository.findAllById(request.getOfferedDestinationIds()));
        tourPackageRepository.save(tourPackage);

        return BasicResponse.ok();
    }

    public BasicResponse editPackage(TourPackageDTO request) {
        Optional<TourPackage> opPackage = tourPackageRepository.findById(request.getId());
        if (opPackage.isEmpty()) return BasicResponse.badRequest("No such tour package");

        TourPackage tourPackage = opPackage.get();
        if (request.getDisplayName() != null && !request.getDisplayName().isBlank()) tourPackage.setDisplayName(request.getDisplayName());
        if (request.getPrice() != null) tourPackage.setPrice(request.getPrice());
        tourPackage.addAllDestinations((Collection<? extends Destination>) destinationRepository.findAllById(request.getOfferedDestinationIds()));
        tourPackageRepository.save(tourPackage);

        return BasicResponse.ok();
    }

    public BasicResponse deletePackage(TourPackageDTO request) {
        tourPackageRepository.deleteById(request.getId());

        return BasicResponse.ok();
    }

    public void addDestinationToPackages(Collection<Integer> packageIds, Destination destination) throws PackageException {
        List<TourPackage> packages = (List<TourPackage>) tourPackageRepository.findAllById(packageIds);
        // Cancel operation if a fetch failed
        if (packages.size() != packageIds.size()) throw new PackageException("Package Ids fetch failed");

        for (TourPackage p : packages) {
            p.addDestination(destination);
            tourPackageRepository.save(p);
        }
    }

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
}
