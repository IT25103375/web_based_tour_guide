import {TourPackage} from "@/models/TourPackage.ts";

export interface Destination {
    id: number;
    displayName: string;
    location: string;
    description: string;
    offeredPackageIds: number[];
}

export type DestinationList = Destination[] | null