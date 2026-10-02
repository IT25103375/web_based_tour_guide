package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.DestinationDTO;
import com.webbasedtourguide.entities.Destination;
import com.webbasedtourguide.entities.Rating;
import com.webbasedtourguide.entities.TourGuide;
import com.webbasedtourguide.entities.TourPackage;
import com.webbasedtourguide.enums.GuideStatus;
import com.webbasedtourguide.exceptions.DestinationException;
import com.webbasedtourguide.exceptions.PackageException;
import com.webbasedtourguide.mappers.DestinationMapper;
import com.webbasedtourguide.repositories.DestinationRepository;
import jakarta.persistence.EntityNotFoundException;
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
        destination.setId(null);
        destinationRepository.save(destination);

        if (request.getOfferedPackageIds() != null)
            tourPackageService.addDestinationToPackages(request.getOfferedPackageIds(), destination);

        return BasicResponse.ok();
    }

    @Transactional
    public BasicResponse editDestination(DestinationDTO request) {

        Optional<Destination> opDestination = destinationRepository.findById(request.getId());
        if (opDestination.isEmpty()) return BasicResponse.badRequest("No such destination");

        Destination destination = opDestination.get();
        if (request.getDisplayName() != null && !request.getDisplayName().isBlank()) destination.setDisplayName(request.getDisplayName());
        if (request.getLocation() != null && !request.getLocation().isBlank()) destination.setLocation(request.getLocation());
        if (request.getDescription() != null) destination.setDescription(request.getDescription());
        destinationRepository.save(destination);

        return BasicResponse.ok();
    }

    @Transactional
    public BasicResponse removeDestination(DestinationDTO request) throws PackageException {

        Destination destination = destinationRepository.findById(request.getId())
                .orElseThrow(() -> new DestinationException("Cannot find destination"));

        tourPackageService.removeDestinationFromPackages(destination.getOfferedPackages().stream()
                .map(TourPackage::getId).collect(Collectors.toList()), destination);
        destinationRepository.deleteById(destination.getId());

        return BasicResponse.ok();
    }

    public List<Destination> getDestinations() {
        return (List<Destination>) destinationRepository.findAll();
    }

    public List<Destination> getDestinationsById(List<Integer> ids) {
        return (List<Destination>) destinationRepository.findAllById(ids);
    }

    public List<TourPackage> getPackagesByDestination(Integer destId) {
        return destinationRepository.findById(destId)
                .orElseThrow(() -> new DestinationException("No such destination"))
                .getOfferedPackages();
    }

    public Optional<Destination> getDestination(Integer id) {
        return destinationRepository.findById(id);
    }

    @Transactional
    public void addRating(int dest_id, Rating rating) {
        Destination dest = destinationRepository.findById(dest_id)
                .orElseThrow(() -> new EntityNotFoundException("Destination not found"));

        dest.addRating(rating);
        destinationRepository.save(dest);
    }

    public List<Rating> getRatings(int dest_id, int count) {
        Destination dest = destinationRepository.findById(dest_id)
                .orElseThrow(() -> new EntityNotFoundException("Destination not found"));

        return dest.getRatings(count);
    }

    public double getRatingAvg(int dest_id) {
        Destination dest = destinationRepository.findById(dest_id)
                .orElseThrow(() -> new EntityNotFoundException("Destination not found"));

        return dest.getRatingAvg();
    }
}
