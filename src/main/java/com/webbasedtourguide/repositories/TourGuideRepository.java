package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.TourGuide;
import com.webbasedtourguide.enums.GuideStatus;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

public interface TourGuideRepository extends CrudRepository<TourGuide, Integer> {

    Optional<TourGuide> findByAuthEntity_Email(String email);

    // Using bitmask to represent days of week and their combinations, monday = 1, tuesday = 2, wednesday = 4 etc.
    @Query(
            value = "SELECT * FROM tour_guide WHERE status <> 'UNAVAILABLE' AND BITAND(active_days, CAST(?1 AS INT)) <> 0",
            nativeQuery = true)
    List<TourGuide> findAvailableGuides(@Param("day") int day);

    @Modifying
    @Query("UPDATE TourGuide g SET g.status = :status WHERE g.id = :id")
    int updateGuideStatus(int id, GuideStatus status);
}