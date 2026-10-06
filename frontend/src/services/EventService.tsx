import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import {EventEntity, EventList} from "../models/EventEntity.ts";
import type {EventDetails} from "../models/EventDetails.ts";

const api = "http://localhost:8090/";

export const eventAPI = {

    getAllEventsAdmin: async () => {
        try {
            return await axios.get<EventList>(api + "api/event/admin");
        } catch (error) {
            handleError(error);
        }
    },

    addEvent: async (event: Omit<Omit<EventEntity, "eventId">, "avgRating">) => {
        try {
            return await axios.post<string>(api + "api/event/admin", event);
        } catch (error) {
            handleError(error);
        }
    },

    editEvent: async (event: Omit<EventEntity, "avgRating">) => {
        try {
            return await axios.put<string>(api + "api/event/admin", event);
        } catch (error) {
            handleError(error);
        }
    },

    deleteEvent: async (eventId: number) => {
        try {
            return await axios.delete<string>(api + "api/event/admin", { data: { eventId } });
        } catch (error) {
            handleError(error);
        }
    },

    getEventsByPackage: async (pkgId: number) => {
        try {
            // Query param, not a body: browsers drop the body of a GET request
            return await axios.get<EventDetails[]>(api + "api/event", {
                params: { pkgId },
            });
        } catch (error) {
            handleError(error);
        }
    },

    // The event is attached to one of the tourist's own bookings
    registerEvent: async (eventId: number, bookingId: number) => {
        try {
            const form = new URLSearchParams();
            form.append("eventId", String(eventId));
            form.append("bookingId", String(bookingId));
            return await axios.post<string>(api + "api/event/book", form, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
        } catch (error) {
            handleError(error);
        }
    },
};