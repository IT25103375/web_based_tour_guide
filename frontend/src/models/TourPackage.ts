export interface TourPackage {
    id: number;
    displayName: string;
    price: number;
    duration: number;
    description: string;
    capacity: number;
    offeredDestinationNames: string[];
    offeredDestinationIds: number[];
}

export type TourPackageList = TourPackage[] | null