package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.AuthEntity;
import com.webbasedtourguide.entities.Event;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends CrudRepository<Event, Integer> {

    @Modifying
    @Query("UPDATE Event e SET e.endDate = :now WHERE e.id = :id")
    int discontinueEvent(Integer id, Instant now);

    @Query("SELECT e FROM Event e JOIN e.applicablePackages p WHERE e.id = :evtId AND p.id = :pkgId " +
            "AND e.startDate >= :now AND e.endDate < :now")
    Optional<Event> getValidEvent(Integer eventId, Integer pkgId, Instant now);

    @Query("SELECT e FROM Event e JOIN e.applicablePackages p WHERE p.id = :pkgId " +
            "AND e.startDate >= :now AND e.endDate < :now")
    List<Event> getValidEvents(Integer pkgId, Instant now);
}