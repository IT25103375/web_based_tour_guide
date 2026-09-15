import {TourPackage} from "@/models/TourPackage.ts";

export interface Destination {
    id: number;
    displayName: string;
    location: string;
}

export type DestinationList = Destination[] | null