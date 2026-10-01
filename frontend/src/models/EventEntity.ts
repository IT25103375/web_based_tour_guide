export interface EventEntity {
    eventId: number;
    eventName: string;
    location: string;
    description: string;
    capacity: number;
    price: number;
    startDate: string; // ISO instant
    endDate: string; // ISO instant
    avgRating: number;
    applicablePackages: number[];
}

export type EventList = EventEntity[] | null