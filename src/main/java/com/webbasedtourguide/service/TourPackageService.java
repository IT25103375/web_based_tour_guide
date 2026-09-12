package com.webbasedtourguide.service;

import com.webbasedtourguide.entities.TourPackage;
import com.webbasedtourguide.exceptions.PackageException;
import com.webbasedtourguide.repositories.TourPackageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
class TourPackageService {

    private final TourPackageRepository tourPackageRepository;

    TourPackageService(TourPackageRepository tourPackageRepository) {
        this.tourPackageRepository = tourPackageRepository;
    }

    List<TourPackage> getPackages(List<Integer> ids) throws PackageException {
        List<TourPackage> packages = (List<TourPackage>) tourPackageRepository.findAllById(ids);
        if (packages.isEmpty()) throw new PackageException("No matching packages");
        return packages;
    }

    
}
