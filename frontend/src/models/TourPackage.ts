export interface TourPackage {
    id: number;
    displayName: string;
    price: number;
    duration: number;
    description: string;
    capacity: number;
    avgRating: number;
    offeredDestinationIds: number[] | null;
    offeredDestinationNames: string[] | null;
}

export type TourPackageList = TourPackage[] | null