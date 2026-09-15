import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import type {TripList, TripSet} from "../models/Trip.ts";
import {vehicleAPI} from "./VehicleService.tsx";
import {Bounce, toast} from "react-toastify";

const api="http://localhost:8090/";

export const tripAPI = {
    getTrips: async () => {
        try{
            return await axios.get<TripList>(api + "api/booking/trip", {
            });
        }
        catch(error)
        {
            handleError(error);
        }
    },

    getDriverTrips: async () => {
        try{
            return await axios.get<TripList>(api + "api/booking/poll", {
            });
        }
        catch(error)
        {
            const currentVehicle = await vehicleAPI.getCurrent();
            // Appropriate page will throw the relevant error
            if (currentVehicle?.data) handleError(error);
        }
    },

    postTrip: async (vehicleTypeId: number, startAddress: string, startSubRegionId: number,
                     destAddress: string, destSubRegionId: number) => {
        try{
            return await axios.post<TripSet>(api + "api/booking/trip", {
                vehicleTypeId: vehicleTypeId,
                startAddress: startAddress,
                startSubRegionId: startSubRegionId,
                destAddress: destAddress,
                destSubRegionId: destSubRegionId
            })
        }
        catch (error)
        {
            handleError(error);
        }
    },

    assignForTrip: async (tripId : number) => {
        try{
            return await axios.patch<string>(api + "api/booking/assign-driver", {
                tripId: tripId,
            })
        }
        catch (error)
        {
            handleError(error);
        }
    },

    startTrip: async (tripId : number) => {
        try{
            return await axios.patch<string>(api + "api/booking/start-trip", {
                tripId: tripId,
            })
        }
        catch (error)
        {
            handleError(error);
        }
    },

    finishTrip: async (tripId: number, tripKM : number) => {
        try{
            return await axios.patch<string>(api + "api/booking/finish-trip", {
                tripId: tripId,
                tripKM: tripKM,
            })
        }
        catch (error)
        {
            handleError(error);
        }
    },

    cancelTrip: async (tripId : number) => {
        try{
            return await axios.patch<string>(api + "api/booking/cancel-trip", {
                tripId: tripId,
            })
        }
        catch (error)
        {
            handleError(error);
        }
    }
}