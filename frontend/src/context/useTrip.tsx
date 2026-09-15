import React, {createContext, useContext, useEffect, useState} from "react";
import { tripAPI } from "../services/TripService.tsx";
import {handleError} from "../helpers/ErrorHandler.tsx";
import type {RegionGet} from "../models/Region.ts";
import type {SubRegionGet} from "../models/SubRegion.ts";
import type {TripGet} from "../models/Trip.ts";
import {UserType} from "../enums/UserType.ts";
import {registerAPI} from "../services/AuthService.tsx";
import {Bounce, Slide, toast} from "react-toastify";
import {useAuth} from "./useAuth.tsx";
import {useVehicle} from "./useVehicle.tsx";

type TripContextType = {
    trips: TripGet[] | null;
    driverTrips: TripGet[] | null;
    loadingTrips: boolean;
    loadingDriverTrips: boolean;
    setFetchTrip: (trigger: number) => void;
    fetchTrip: number;
    setFetchDriverTrip: (trigger: number) => void;
    fetchDriverTrip: number;
    bookTrip: (startAddress: string, startSubRegionId: number, destAddress: string,
               destSubRegionId: number, vehicleTypeId: number) => void;
    acceptTrip: (tripId: number) => void;
    pickupTrip: (tripId: number) => void;
    finishTrip: (tripId: number, tripKM: number) => void;
    cancelTrip: (tripId: number) => void;
}

type Props = { children: React.ReactNode };

const TripContext = createContext<TripContextType>({} as TripContextType);

export const TripProvider = ({children} : Props) => {

    const { user, isLoggedIn } = useAuth();

    const [trips, setTrips] = useState<TripGet[] | null>([]);
    const [driverTrips, setDriverTrips] = useState<TripGet[] | null>([]);
    const [loadingTrips, setTripLoading] = useState<boolean>(true);
    const [loadingDriverTrips, setDriverTripLoading] = useState<boolean>(true);
    const [fetchTrip, setFetchTrip] = useState<number>(0);
    const [fetchDriverTrip, setFetchDriverTrip] = useState<number>(0);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                if (!isLoggedIn()) return;
                setTripLoading(true);
                const res = await tripAPI.getTrips();
                if (res) setTrips(res.data);
            } catch (error) {
                handleError(error);
            } finally {
                setTripLoading(false);
            }
        };

        fetchTrips();
    }, [fetchTrip]);

    useEffect(() => {
        const fetchDriverTrips = async () => {
            try {
                if (!isLoggedIn() || user?.role != UserType.Driver) return;
                setDriverTripLoading(true);
                const res = await tripAPI.getDriverTrips();
                if (res) setDriverTrips(res.data);
            } catch (error) {
                handleError(error);
            } finally {
                setDriverTripLoading(false);
            }
        };

        fetchDriverTrips();
    }, [fetchDriverTrip]);

    const bookTrip =
        async (startAddress: string, startSubRegionId: number, destAddress: string,
               destSubRegionId: number, vehicleTypeId: number) => {
            if (!isLoggedIn()) return;
            await tripAPI.postTrip(vehicleTypeId, startAddress, startSubRegionId, destAddress, destSubRegionId)
                .then((res) => {
                    if(res) {
                        toast.success("Trip booked", {
                            hideProgressBar: true,
                            closeOnClick: true,
                            transition: Slide,
                            position: "bottom-right",
                        })
                        return res;
                    }
                }).catch((e) => toast.warning("Server error occurred", {
                    hideProgressBar: true,
                    closeOnClick: true,
                    transition: Bounce,
                    position: "bottom-right",
                }))

            setFetchTrip(fetchTrip + 1);
            setFetchDriverTrip(fetchDriverTrip + 1);
        }

    const acceptTrip =
        async (tripId: number) => {
            if (!isLoggedIn()) return;
            await tripAPI.assignForTrip(tripId)
                .then((res) => {
                    if(res) {
                        toast.success("Trip taken", {
                            hideProgressBar: true,
                            closeOnClick: true,
                            transition: Slide,
                            position: "bottom-right",
                        })
                        return res;
                    }
                }).catch((e) => toast.warning("Server error occurred", {
                    hideProgressBar: true,
                    closeOnClick: true,
                    transition: Bounce,
                    position: "bottom-right",
                }))

            setFetchTrip(fetchTrip + 1);
            setFetchDriverTrip(fetchDriverTrip + 1);
        }

    const pickupTrip =
        async (tripId: number) => {
            if (!isLoggedIn()) return;
            await tripAPI.startTrip(tripId)
                .then((res) => {
                    if(res) {
                        toast.success("Trip started", {
                            hideProgressBar: true,
                            closeOnClick: true,
                            transition: Slide,
                            position: "bottom-right",
                        })
                        return res;
                    }
                }).catch((e) => toast.warning("Server error occurred", {
                    hideProgressBar: true,
                    closeOnClick: true,
                    transition: Bounce,
                    position: "bottom-right",
                }))

            setFetchTrip(fetchTrip + 1);
            setFetchDriverTrip(fetchDriverTrip + 1);
        }

    const finishTrip =
        async (tripId: number, tripKm: number) => {
            if (!isLoggedIn()) return;
            await tripAPI.finishTrip(tripId, tripKm)
                .then((res) => {
                    if(res) {
                        toast.success("Trip finished", {
                            hideProgressBar: true,
                            closeOnClick: true,
                            transition: Slide,
                            position: "bottom-right",
                        })
                        return res;
                    }
                }).catch((e) => toast.warning("Server error occurred", {
                    hideProgressBar: true,
                    closeOnClick: true,
                    transition: Bounce,
                    position: "bottom-right",
                }))

            setFetchTrip(fetchTrip + 1);
            setFetchDriverTrip(fetchDriverTrip + 1);
        }

    const cancelTrip =
        async (tripId: number) => {
            if (!isLoggedIn()) return;
            await tripAPI.cancelTrip(tripId)
                .then((res) => {
                    if(res) {
                        toast.success("Trip cancelled", {
                            hideProgressBar: true,
                            closeOnClick: true,
                            transition: Slide,
                            position: "bottom-right",
                        })
                        return res;
                    }
                }).catch((e) => toast.warning("Server error occurred", {
                    hideProgressBar: true,
                    closeOnClick: true,
                    transition: Bounce,
                    position: "bottom-right",
                }))

            setFetchTrip(fetchTrip + 1);
            setFetchDriverTrip(fetchDriverTrip + 1);
        }

    return (
        <TripContext.Provider value={
            {loadingTrips, loadingDriverTrips, driverTrips, trips, bookTrip, setFetchTrip, fetchTrip,
                setFetchDriverTrip, fetchDriverTrip, acceptTrip, pickupTrip, finishTrip, cancelTrip}}>
            {children}
        </TripContext.Provider>
    )
}

// 4. Custom hook wrapper for cleaner components and runtime safety
export const useTrip = () => {
    const context = useContext(TripContext);
    if (!context) {
        throw new Error("useTrip must be used within a TripProvider");
    }
    return context;
};