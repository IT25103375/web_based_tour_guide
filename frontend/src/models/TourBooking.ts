import {BookingStatus} from "@/enums/BookingStatus.ts";

export interface TourBooking {
    id: number;
    tourPackageId: number;
    touristId: number;
    eventId?: number;
    guideId: number;
    discountId?: number;
    status: BookingStatus;
    finalPrice: number;
    bookedDate: string; // ISO instant
}