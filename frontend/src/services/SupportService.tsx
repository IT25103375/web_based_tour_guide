import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import type { Ticket } from "../models/Ticket.ts";
import type { Rating } from "../models/Rating.ts";
import type { RatingType } from "../enums/RatingType.ts";

const api = "http://localhost:8090/";

export const supportAPI = {
    getTickets: async () => {
        try {
            return await axios.get<Ticket[]>(api + "api/support/ticket");
        } catch (error) {
            handleError(error);
        }
    },

    // Admin only: every ticket from every user
    getAllTickets: async () => {
        try {
            return await axios.get<Ticket[]>(api + "api/support/ticket/all");
        } catch (error) {
            handleError(error);
        }
    },

    getTicket: async (id: number) => {
        try {
            return await axios.get<Ticket>(api + `api/support/ticket/${id}`);
        } catch (error) {
            handleError(error);
        }
    },

    // Backend expects a TicketDTO whose first message holds the ticket body
    createTicket: async (title: string, content: string) => {
        try {
            return await axios.post<Ticket>(api + "api/support/ticket", {
                title: title,
                messages: [{ content: content }],
            });
        } catch (error) {
            handleError(error);
        }
    },

    respondToTicket: async (id: number, content: string) => {
        try {
            return await axios.patch(api + `api/support/ticket/${id}`, {
                messages: [{ content: content }],
            });
        } catch (error) {
            handleError(error);
        }
    },

    solveTicket: async (id: number) => {
        try {
            return await axios.patch(api + `api/support/ticket/${id}/solve`);
        } catch (error) {
            handleError(error);
        }
    },

    getRatings: async (type: RatingType, typeId: number) => {
        try {
            return await axios.get<Rating[]>(api + "api/support/rating", { params: { type, typeId } });
        } catch (error) {
            handleError(error);
        }
    },

    postRating: async (rating: Rating) => {
        try {
            return await axios.post(api + "api/support/rating", rating);
        } catch (error) {
            handleError(error);
        }
    },
};
