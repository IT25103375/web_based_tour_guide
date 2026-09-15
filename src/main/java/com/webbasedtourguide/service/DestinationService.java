package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.DestinationDTO;
import com.webbasedtourguide.entities.Destination;
import com.webbasedtourguide.entities.TourPackage;
import com.webbasedtourguide.exceptions.DestinationException;
import com.webbasedtourguide.exceptions.PackageException;
import com.webbasedtourguide.mappers.DestinationMapper;
import com.webbasedtourguide.repositories.DestinationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;
    private final TourPackageService tourPackageService;
    private final DestinationMapper destinationMapper;

    DestinationService(DestinationRepository destinationRepository, TourPackageService tourPackageService, DestinationMapper destinationMapper) {
        this.destinationRepository = destinationRepository;
        this.tourPackageService = tourPackageService;
        this.destinationMapper = destinationMapper;
    }

    @Transactional
    public BasicResponse addDestination(DestinationDTO request) throws PackageException {

        Destination destination = destinationMapper.toEntity(request);
        destinationRepository.save(destination);

        tourPackageService.addDestinationToPackages(request.getOfferedPackageIds(), destination);

        return BasicResponse.ok();
    }

    @Transactional
    public BasicResponse removeDestination(DestinationDTO request) throws PackageException {

        Destination destination = destinationRepository.findById(request.getId())
                .orElseThrow(() -> new DestinationException("Cannot find destination"));

        tourPackageService.removeDestinationFromPackages(destination.getOfferedPackages().stream()
                .map(TourPackage::getId).collect(Collectors.toList()), destination);

        return BasicResponse.ok();
    }

    public List<Destination> getDestinations() {
        return (List<Destination>) destinationRepository.findAll();
    }

    public List<TourPackage> getPackagesByDestination(Integer destId) {
        return destinationRepository.findById(destId)
                .orElseThrow(() -> new DestinationException("No such destination"))
                .getOfferedPackages();
    }

    public Optional<Destination> getDestination(Integer id) {
        return destinationRepository.findById(id);
    }
}
