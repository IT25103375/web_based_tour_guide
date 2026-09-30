export interface Destination {
    id: number | undefined;
    displayName: string;
    location: string;
    description: string;
    offeredPackageIds: number[];
}

export type DestinationList = Destination[] | null