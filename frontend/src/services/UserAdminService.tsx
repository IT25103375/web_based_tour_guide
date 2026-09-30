import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import type { UserType } from "../enums/UserType.ts";
import {UserPost, UserGet} from "@/models/User.ts";

const api = "http://localhost:8090/";

export const userAdminAPI = {
    getUsers: async () => {
        try {
            return await axios.get<UserGet[]>(api + "api/user");
        } catch (error) {
            handleError(error);
        }
    },

    addUser: async (userDetails: UserPost) => {
        try {
            return await axios.post(api + "api/user/auth/register", userDetails);
        } catch (error) {
            handleError(error);
        }
    },

    updateUserRole: async (id: number, role: UserType) => {
        try {
            return await axios.put<string>(api + `api/user/${id}/role`, null, { params: { role } });
        } catch (error) {
            handleError(error);
        }
    },

    deleteUser: async (id: number) => {
        try {
            return await axios.delete<string>(api + `api/user/${id}`);
        } catch (error) {
            handleError(error);
        }
    },
};