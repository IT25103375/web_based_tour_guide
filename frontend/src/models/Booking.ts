import {BookingStatus} from "@/enums/BookingStatus.ts";

export interface Booking {
    id: number;
    tourPackageId: number;
    packageName: string;
    touristId: number;
    eventId?: number;
    guideId: number;
    guideName: string;
    couponCode?: number;
    status: BookingStatus;
    finalPrice: number;
    bookedDate: string; // ISO instant
}

export type BookingList = Booking[] | null