import {BookingStatus} from "@/enums/BookingStatus.ts";

// Matches the backend's BookingDetailsDTO (GET /api/booking)
export interface Booking {
    bookingId: number;
    bookerId: number;
    packageId: number;
    eventId?: number;
    guideId?: number | null;
    guideName?: string | null;
    packageName: string;
    couponCode?: string;
    status: BookingStatus;
    finalPrice: number;
    bookedDate: string; // ISO instant
}

export type BookingList = Booking[] | null
