export interface EventEntity {
    eventId: number | undefined;
    eventName: string;
    location: string;
    description: string;
    capacity: number;
    price: number;
    startDate: string; // ISO instant
    endDate: string; // ISO instant
    applicablePackages: number[];
}

export type EventList = EventEntity[] | null