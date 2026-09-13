package com.webbasedtourguide.mappers;

import com.webbasedtourguide.entities.Destination;
import com.webbasedtourguide.entities.TourPackage;
import com.webbasedtourguide.repositories.DestinationRepository;
import com.webbasedtourguide.repositories.TourPackageRepository;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class IdResolver {

    @Autowired
    private DestinationRepository destinationRepository;

    @Autowired
    private TourPackageRepository tourPackageRepository;

    @Named("idsToDestinations")
    public List<Destination> idsToDestinations(List<Integer> ids) {
        if (ids == null) {
            return null;
        }
        return ids.stream()
                .map(id -> destinationRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Destination not found: " + id)))
                .collect(Collectors.toList());
    }

    @Named("idsToPackages")
    public List<TourPackage> idsToPackages(List<Integer> ids) {
        if (ids == null) {
            return null;
        }
        return ids.stream()
                .map(id -> tourPackageRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("TourPackage not found: " + id)))
                .collect(Collectors.toList());
    }

    @Named("packagesToIds")
    public List<Integer> packagesToIds(List<TourPackage> packages) {
        if (packages == null) {
            return null;
        }
        return packages.stream()
                .map(TourPackage::getId)
                .collect(Collectors.toList());
    }

    @Named("destinationsToIds")
    public List<Integer> destinationsToIds(List<Destination> destinations) {
        if (destinations == null) {
            return null;
        }
        return destinations.stream()
                .map(Destination::getId)
                .collect(Collectors.toList());
    }
}