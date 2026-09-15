// eventService.js
// Thin fetch wrapper around the /api/events endpoints.
// ASSUMPTION: backend runs on the same origin or a proxy is set up in package.json
// ("proxy": "http://localhost:8080"). Adjust BASE_URL below if not.

const BASE_URL = "/api/events";

async function handleResponse(response) {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = (data && data.message) || "Request failed";
    throw new Error(message);
  }
  return data;
}

export async function getEventsForPackage(pkgId) {
  const res = await fetch(`${BASE_URL}/package/${pkgId}`);
  return handleResponse(res);
}

export async function getEventDetails(eventId, pkgId) {
  const res = await fetch(`${BASE_URL}/${eventId}/package/${pkgId}`);
  return handleResponse(res);
}

export async function getParticipantCount(eventId) {
  const res = await fetch(`${BASE_URL}/${eventId}/participants`);
  return handleResponse(res);
}

export async function registerForEvent(bookingId, eventId, touristId) {
  const params = new URLSearchParams({ bookingId, eventId, touristId });
  const res = await fetch(`${BASE_URL}/register?${params.toString()}`, {
    method: "POST",
  });
  return handleResponse(res);
}

export async function createEvent(eventControlDTO) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventControlDTO),
  });
  return handleResponse(res);
}

export async function discontinueEvent(eventControlDTO) {
  const res = await fetch(`${BASE_URL}/discontinue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventControlDTO),
  });
  return handleResponse(res);
}
