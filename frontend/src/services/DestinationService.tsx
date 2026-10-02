import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import type { DestinationList, Destination } from "../models/Destination.ts";
import type { TourPackageList } from "../models/TourPackage.ts";

const api = "http://localhost:8090/";

export const destinationAPI = {
    getDestinations: async () => {
        try {
            return await axios.get<DestinationList>(api + "api/destination");
        } catch (error) {
            handleError(error);
        }
    },

    getPackagesByDestination: async (id: number) => {
        try {
            return await axios.get<TourPackageList>(api + "api/destination/destination", {
                data: { id },
            });
        } catch (error) {
            handleError(error);
        }
    },

    addDestination: async (destination: Omit<Destination, "id" | "avgRating">) => {
        try {
            return await axios.post<string>(api + "api/destination", destination);
        } catch (error) {
            handleError(error);
        }
    },

    editDestination: async (destination: Omit<Destination, "avgRating">) => {
        try {
            return await axios.put<string>(api + "api/destination", destination);
        } catch (error) {
            handleError(error);
        }
    },

    removeDestination: async (id: number) => {
        try {
            return await axios.delete<string>(api + "api/destination", {
                data: { id },
            });
        } catch (error) {
            handleError(error);
        }
    },
};
