import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import type { Guide } from "../models/User.ts";

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
};
