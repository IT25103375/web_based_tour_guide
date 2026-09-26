import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import {Event, EventList} from "../models/Event.ts";

const api = "http://localhost:8090/";

export const eventAPI = {

    getAllEventsAdmin: async () => {
        try {
            return await axios.get<EventList[]>(api + "api/event/admin");
        } catch (error) {
            handleError(error);
        }
    },

    addEvent: async (event: Omit<Event, "eventId">) => {
        try {
            return await axios.post<string>(api + "api/event/admin", event);
        } catch (error) {
            handleError(error);
        }
    },

    editEvent: async (event: Event) => {
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
            return await axios.get<EventList>(api + "api/event", {
                data: pkgId,
            });
        } catch (error) {
            handleError(error);
        }
    },

    registerEvent: async (eventId: number, pkgId: number) => {
        try {
            const form = new URLSearchParams();
            form.append("eventId", String(eventId));
            form.append("pkgId", String(pkgId));
            return await axios.post<string>(api + "api/event/book", form, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
        } catch (error) {
            handleError(error);
        }
    },
};