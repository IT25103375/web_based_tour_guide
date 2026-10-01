package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.TicketDTO;
import com.webbasedtourguide.entities.Rating;
import com.webbasedtourguide.entities.TourGuide;
import com.webbasedtourguide.enums.GuideStatus;
import com.webbasedtourguide.exceptions.GuideException;
import com.webbasedtourguide.repositories.TourGuideRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TourGuideService {

    private final TourGuideRepository guideRepository;

    TourGuideService(TourGuideRepository guideRepository) {
        this.guideRepository = guideRepository;
    }

    public TourGuide getGuide(Integer id) {
        return guideRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Tour guide not found"));
    }

    public TourGuide findSuitableGuide(Instant bookedDate) throws GuideException {
        DayOfWeek tourDay = bookedDate.atZone(ZoneId.systemDefault()).getDayOfWeek();
        int bitmask = 1 << tourDay.ordinal();

        List<TourGuide> guides = guideRepository.findAvailableGuides(bitmask);
        if (!guides.isEmpty()) return guides.getFirst();
        else throw new GuideException("No guides available!");
    }

    @Transactional
    public boolean cancelGuideBooking(Integer id) {
        return guideRepository.updateGuideStatus(id, GuideStatus.AVAILABLE) == 1;
    }

    @Transactional
    public void setGuideBooked(Integer id) {
        guideRepository.updateGuideStatus(id, GuideStatus.BOOKED);
    }

    @Transactional
    public void addRating(int guide_id, Rating rating) {
        TourGuide guide = guideRepository.findById(guide_id)
                .orElseThrow(() -> new EntityNotFoundException("Tour Guide not found"));

        guide.addRating(rating);
        guideRepository.save(guide);
    }

    public List<Rating> getRatings(int guide_id, int count) {
        TourGuide guide = guideRepository.findById(guide_id)
                .orElseThrow(() -> new EntityNotFoundException("Tour Guide not found"));

        return guide.getRatings(count);
    }

    public int getRatingAvg(int guide_id) {
        TourGuide guide = guideRepository.findById(guide_id)
                .orElseThrow(() -> new EntityNotFoundException("Tour Guide not found"));

        return guide.getRatingAvg();
    }
}
