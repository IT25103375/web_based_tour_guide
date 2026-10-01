import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import type { Notification } from "../models/Notification.ts";

const api = "http://localhost:8090/";

export const notificationAPI = {
    getPendingNotifications: async () => {
        try {
            return await axios.get<Notification[]>(api + "api/notification");
        } catch (error) {
            handleError(error);
        }
    },

    removeNotification: async (id: number) => {
        try {
            return await axios.delete(api + `api/notification/${id}`);
        } catch (error) {
            handleError(error);
        }
    },

    clearNotifications: async () => {
        try {
            return await axios.delete(api + "api/notification");
        } catch (error) {
            handleError(error);
        }
    },
};
