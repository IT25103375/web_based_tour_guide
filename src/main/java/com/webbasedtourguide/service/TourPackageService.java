package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.TourPackageDTO;
import com.webbasedtourguide.entities.Destination;
import com.webbasedtourguide.entities.TourPackage;
import com.webbasedtourguide.exceptions.PackageException;
import com.webbasedtourguide.mappers.TourPackageMapper;
import com.webbasedtourguide.repositories.TourPackageRepository;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
public class TourPackageService {

    private final TourPackageRepository tourPackageRepository;
    private final TourPackageMapper tourPackageMapper;

    TourPackageService(TourPackageRepository tourPackageRepository, TourPackageMapper tourPackageMapper) {
        this.tourPackageRepository = tourPackageRepository;
        this.tourPackageMapper = tourPackageMapper;
    }

    public List<TourPackage> getPackages(List<Integer> ids) throws PackageException {
        List<TourPackage> packages = (List<TourPackage>) tourPackageRepository.findAllById(ids);
        if (packages.isEmpty()) throw new PackageException("No matching packages");
        return packages;
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
