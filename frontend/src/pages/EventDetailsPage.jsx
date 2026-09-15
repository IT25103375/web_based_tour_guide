import React, { useEffect, useState } from "react";
import { getEventDetails, registerForEvent, getParticipantCount } from "../api/eventService";
import "./Events.css";

// ASSUMPTION: bookingId and touristId are passed down from wherever the app
// already tracks the logged-in tourist and their active booking. touristId
// especially is a placeholder until the auth side of the project exposes it
// properly (see EventController.java note) — do not hardcode this in real use.
export default function EventDetailsPage({ eventId, pkgId, bookingId, touristId }) {
  const [event, setEvent] = useState(null);
  const [participantCount, setParticipantCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [details, count] = await Promise.all([
          getEventDetails(eventId, pkgId),
          getParticipantCount(eventId),
        ]);
        if (!cancelled) {
          setEvent(details);
          setParticipantCount(count);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [eventId, pkgId]);

  async function handleConfirmRegister() {
    setRegistering(true);
    setError(null);
    try {
      await registerForEvent(bookingId, eventId, touristId);
      setRegistered(true);
      setConfirming(false);
      const updatedCount = await getParticipantCount(eventId);
      setParticipantCount(updatedCount);
    } catch (err) {
      setError(err.message);
      setConfirming(false);
    } finally {
      setRegistering(false);
    }
  }

  if (loading) return <p className="events-status">Loading event…</p>;
  if (error && !event) return <p className="events-status events-status--error">{error}</p>;
  if (!event) return null;

  return (
    <div className="event-details">
      <h2>{event.eventName}</h2>
      <p className="event-details__location">{event.location}</p>
      {event.finalPrice != null && (
        <p className="event-details__price">Price: {event.finalPrice}</p>
      )}
      {participantCount != null && (
        <p className="event-details__count">{participantCount} tourists registered so far</p>
      )}

      {registered ? (
        <p className="events-status events-status--success">
          You're registered for this event.
        </p>
      ) : confirming ? (
        <div className="event-details__confirm">
          <p>Confirm registration for this event?</p>
          <button onClick={handleConfirmRegister} disabled={registering}>
            {registering ? "Registering…" : "Confirm"}
          </button>
          <button onClick={() => setConfirming(false)} disabled={registering}>
            Cancel
          </button>
        </div>
      ) : (
        <button className="event-details__register" onClick={() => setConfirming(true)}>
          Register
        </button>
      )}

      {error && <p className="events-status events-status--error">{error}</p>}
    </div>
  );
}
