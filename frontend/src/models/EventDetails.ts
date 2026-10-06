// Matches the backend's EventDetailsDTO (GET /api/event?pkgId=...), the tourist-facing event shape
export interface EventDetails {
    eventId: number;
    pkgId?: number;
    displayName: string;
    location: string;
    description: string;
    price: number;
    capacity: number | null;
    availableSpots: number | null; // null when the event has no capacity limit
    startDate: string; // ISO instant
    endDate: string; // ISO instant
    avgRating: number;
}
