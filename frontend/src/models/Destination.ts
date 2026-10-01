export interface Destination {
    id: number;
    displayName: string;
    location: string;
    description: string;
    avgRating: number;
    offeredPackageIds: number[];
}

export type DestinationList = Destination[] | null