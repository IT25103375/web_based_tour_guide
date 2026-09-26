import {TourPackage} from "@/models/TourPackage.ts";

export interface Event {
    id: number;
    displayName: string;
    location: string;
    description: string;
    capacity: number;
    price: number;
    startDate: string; // ISO instant
    endDate: string; // ISO instant
    applicablePackages: number[];
}

export type EventList = Event[] | null