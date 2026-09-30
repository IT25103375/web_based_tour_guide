export interface TourPackage {
    id: number | undefined;
    displayName: string;
    price: number;
    duration: number;
    description: string;
    capacity: number;
    offeredDestinationIds: number[] | null;
}

export type TourPackageList = TourPackage[] | null