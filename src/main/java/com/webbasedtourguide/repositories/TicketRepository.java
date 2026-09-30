package com.webbasedtourguide.repositories;

import com.webbasedtourguide.entities.Ticket;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TicketRepository extends CrudRepository<Ticket, Long> {

    @Query("SELECT t FROM Ticket t JOIN t.authEntities ae WHERE ae.id = :AuthId")
    public List<Ticket> getTicketsSubscribedTo(int AuthId);
}
