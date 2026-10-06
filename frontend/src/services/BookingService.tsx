import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import type { Booking, BookingList } from "../models/Booking.ts";
import type { PriceQuote } from "../models/PriceQuote.ts";

const api = "http://localhost:8090/";

export const bookingAPI = {
    getMyBookings: async () => {
        try {
            return await axios.get<BookingList>(api + "api/booking");
        } catch (error) {
            handleError(error);
        }
    },

    // Backend binds BookingDetailsDTO as request params (no @RequestBody), so send as form data
    bookTour: async (packageId: number | undefined, bookedDate: string, couponCode?: string) => {
        try {
            const form = new URLSearchParams();
            form.append("packageId", String(packageId));
            form.append("bookedDate", new Date(bookedDate).toISOString());
            if (couponCode) form.append("couponCode", couponCode);
            return await axios.post<Booking>(api + "api/booking/book", form, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
        } catch (error) {
            handleError(error);
        }
    },

    // Price preview, including any timed discount or the given coupon. Errors (e.g. an invalid
    // coupon) come back as a 400 with a message, which handleError toasts.
    getQuote: async (packageId: number, couponCode?: string) => {
        try {
            return await axios.get<PriceQuote>(api + "api/booking/quote", {
                params: { packageId, couponCode: couponCode || undefined },
            });
        } catch (error) {
            handleError(error);
        }
    },

    cancelTour: async (bookingId: number) => {
        try {
            const form = new URLSearchParams();
            form.append("bookingId", String(bookingId));
            return await axios.post<string>(api + "api/booking/cancel", form, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
        } catch (error) {
            handleError(error);
        }
    },
};
