import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import type { EventList } from "../models/Event.ts";

const api = "http://localhost:8090/";

export interface EventAdmin {
    eventId: number;
    eventName: string;
    location: string;
    price: number;
    startDate: string; // ISO instant
    endDate: string; // ISO instant
    capacity: number;
    applicablePackages: number[];
}

export const eventAPI = {
    // --- Admin CRUD ---
    getAllEventsAdmin: async () => {
        try {
            return await axios.get<EventAdmin[]>(api + "api/event/admin");
        } catch (error) {
            handleError(error);
        }
    },

    addEvent: async (event: Omit<EventAdmin, "eventId">) => {
        try {
            return await axios.post<string>(api + "api/event/admin", event);
        } catch (error) {
            handleError(error);
        }
    },

    editEvent: async (event: EventAdmin) => {
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

    // Backend binds pkgId from a JSON body on a GET request
    getEventsByPackage: async (pkgId: number) => {
        try {
            return await axios.get<EventList>(api + "api/event", {
                data: pkgId,
            });
        } catch (error) {
            handleError(error);
        }
    },

    // Backend binds EventDetailsDTO as request params (no @RequestBody), so send as form data
    registerEvent: async (eventId: number, pkgId: number, location: string) => {
        try {
            const form = new URLSearchParams();
            form.append("eventId", String(eventId));
            form.append("pkgId", String(pkgId));
            form.append("location", location);
            return await axios.post<string>(api + "api/event/book", form, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
        } catch (error) {
            handleError(error);
        }
    },
};