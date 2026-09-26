import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import type { TourPackageList, TourPackage } from "../models/TourPackage.ts";

const api = "http://localhost:8090/";

export const tourPackageAPI = {
    getPackages: async () => {
        try {
            return await axios.get<TourPackageList>(api + "api/pacakge");
        } catch (error) {
            handleError(error);
        }
    },

    addPackage: async (tourPackage: Omit<TourPackage, "id">) => {
        try {
            return await axios.post<TourPackage>(api + "api/pacakge", tourPackage);
        } catch (error) {
            handleError(error);
        }
    },

    editPackage: async (tourPackage: TourPackage) => {
        try {
            return await axios.put<TourPackage>(api + "api/pacakge", tourPackage);
        } catch (error) {
            handleError(error);
        }
    },

    deletePackage: async (id: number) => {
        try {
            return await axios.delete<string>(api + "api/pacakge", {
                data: { id },
            });
        } catch (error) {
            handleError(error);
        }
    },
};
