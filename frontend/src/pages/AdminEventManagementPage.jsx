import React, { useState } from "react";
import { createEvent, discontinueEvent } from "../api/eventService";
import "./Events.css";

// ASSUMPTION: applicablePackages is entered as a comma-separated list of
// package ids for now — swap for a real multi-select once TourPackage list
// data is available to this page.
export default function AdminEventManagementPage() {
  const [form, setForm] = useState({
    eventName: "",
    location: "",
    price: "",
    startDate: "",
    endDate: "",
    applicablePackages: "",
  });
  const [discontinueId, setDiscontinueId] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const payload = {
        eventName: form.eventName,
        location: form.location,
        price: Number(form.price),
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        applicablePackages: form.applicablePackages
          .split(",")
          .map((id) => Number(id.trim()))
          .filter((id) => !Number.isNaN(id)),
      };
      await createEvent(payload);
      setMessage("Event created.");
      setForm({
        eventName: "",
        location: "",
        price: "",
        startDate: "",
        endDate: "",
        applicablePackages: "",
      });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDiscontinue(e) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await discontinueEvent({ eventId: Number(discontinueId) });
      setMessage("Event discontinued.");
      setDiscontinueId("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="admin-events">
      <h2>Manage events</h2>

      <form onSubmit={handleCreate} className="admin-events__form">
        <h3>Add event</h3>
        <input
          placeholder="Event name"
          value={form.eventName}
          onChange={(e) => updateField("eventName", e.target.value)}
          required
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
          required
        />
        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => updateField("price", e.target.value)}
          required
        />
        <label>
          Start date
          <input
            type="datetime-local"
            value={form.startDate}
            onChange={(e) => updateField("startDate", e.target.value)}
            required
          />
        </label>
        <label>
          End date
          <input
            type="datetime-local"
            value={form.endDate}
            onChange={(e) => updateField("endDate", e.target.value)}
            required
          />
        </label>
        <input
          placeholder="Applicable package ids, comma separated"
          value={form.applicablePackages}
          onChange={(e) => updateField("applicablePackages", e.target.value)}
          required
        />
        <button type="submit">Create event</button>
      </form>

      <form onSubmit={handleDiscontinue} className="admin-events__form">
        <h3>Discontinue event</h3>
        <input
          placeholder="Event id"
          value={discontinueId}
          onChange={(e) => setDiscontinueId(e.target.value)}
          required
        />
        <button type="submit">Discontinue</button>
      </form>

      {message && <p className="events-status events-status--success">{message}</p>}
      {error && <p className="events-status events-status--error">{error}</p>}
    </div>
  );
}
