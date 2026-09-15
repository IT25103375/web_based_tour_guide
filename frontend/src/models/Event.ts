import {TourPackage} from "@/models/TourPackage.ts";

export interface Event {
    id: number;
    displayName: string;
    location: string;
    price: number;
    startDate: string; // ISO instant
    endDate: string; // ISO instant
}

export type EventList = Event[] | null