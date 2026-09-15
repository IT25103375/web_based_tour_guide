export interface TourPackage {
    id: number;
    displayName: string;
    price: number;
    destinationIds: number[];
}

export type TourPackageList = TourPackage[] | null