package com.webbasedtourguide.service;

import com.webbasedtourguide.entities.TourGuide;
import com.webbasedtourguide.exceptions.GuideException;
import com.webbasedtourguide.repositories.TourGuideRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;

@Service
class TourGuideService {

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

        // TODO: Some kind of method to pick most suitable guide; currently picking query first
        List<TourGuide> guides = guideRepository.findAvailableGuides(bitmask);
        if (!guides.isEmpty()) return guides.getFirst();
        else throw new GuideException("No guides available!");
    }
}
