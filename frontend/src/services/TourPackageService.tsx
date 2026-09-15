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

    addPackage: async (displayName: string, price: number, offeredDestinationIds: number[] = []) => {
        try {
            return await axios.post<TourPackage>(api + "api/pacakge", {
                displayName,
                price,
                offeredDestinationIds,
            });
        } catch (error) {
            handleError(error);
        }
    },

    editPackage: async (id: number, displayName: string, price: number, offeredDestinationIds: number[] = []) => {
        try {
            return await axios.put<TourPackage>(api + "api/pacakge", {
                id,
                displayName,
                price,
                offeredDestinationIds,
            });
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
