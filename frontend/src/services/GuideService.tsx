import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import type { Guide } from "../models/User.ts";
import type { DayOfWeek } from "../enums/DayOfWeek.ts";
import type { GuideStatus } from "../enums/GuideStatus.ts";

const api = "http://localhost:8090/";

export const guideAPI = {
    // The id is the guide's user (auth entity) id, as returned in booking.guideId
    getGuide: async (id: number) => {
        try {
            return await axios.get<Guide>(api + `api/user/guide/${id}`);
        } catch (error) {
            handleError(error);
        }
    },

    // Updates the logged-in guide's own days, status and languages
    updateGuide: async (update: { activeDays: DayOfWeek[]; status: GuideStatus; languages: string[] }) => {
        try {
            return await axios.put<string>(api + "api/user/guide", update);
        } catch (error) {
            handleError(error);
        }
    },
};
