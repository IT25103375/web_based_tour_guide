import React, { useEffect, useState } from "react";
import { getEventsForPackage } from "../api/eventService";
import "./Events.css";

// ASSUMPTION: parent screen already knows which package the tourist booked
// (pkgId) and passes it in as a prop, along with a callback for when the
// tourist picks an event to view. No routing library assumed — wire this
// into whatever router/page-switching the rest of the app uses.
export default function EventsPage({ pkgId, onSelectEvent }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      setLoading(true);
      setError(null);
      try {
        const data = await getEventsForPackage(pkgId);
        if (!cancelled) setEvents(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (pkgId) loadEvents();
    return () => {
      cancelled = true;
    };
  }, [pkgId]);

  if (loading) return <p className="events-status">Loading events…</p>;
  if (error) return <p className="events-status events-status--error">{error}</p>;
  if (events.length === 0) return <p className="events-status">No upcoming events for this package yet.</p>;

  return (
    <div className="events-list">
      <h2>Upcoming events</h2>
      {events.map((event) => (
        <button
          key={event.eventId}
          className="event-card"
          onClick={() => onSelectEvent(event.eventId)}
        >
          <span className="event-card__name">{event.eventName}</span>
          <span className="event-card__location">{event.location}</span>
        </button>
      ))}
    </div>
  );
}
