export interface TourPackage {
    id: number | undefined;
    displayName: string;
    price: number;
    duration: number;
    description: string;
    capacity: number;
    avgRating: number;
    offeredDestinationIds: number[] | null;
    offeredDestinationNames: string[] | null;
    offeredEventIds: number[] | null;
    offeredEventNames: string[] | null;
    offeredDiscountIds: number[] | null;
}

export type TourPackageList = TourPackage[] | null