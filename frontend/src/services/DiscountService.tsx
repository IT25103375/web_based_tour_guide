import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";

const api = "http://localhost:8090/";

export interface DiscountAdmin {
    id: number;
    code: string;
    description: string;
    percentage: number;
    minAmount: number;
    active: boolean;
}

export const discountAPI = {
    getDiscounts: async () => {
        try {
            return await axios.get<DiscountAdmin[]>(api + "api/discount");
        } catch (error) {
            handleError(error);
        }
    },

    addDiscount: async (code: string, description: string, percentage: number, minAmount: number, active: boolean) => {
        try {
            return await axios.post<string>(api + "api/discount", { code, description, percentage, minAmount, active });
        } catch (error) {
            handleError(error);
        }
    },

    editDiscount: async (id: number, code: string, description: string, percentage: number, minAmount: number, active: boolean) => {
        try {
            return await axios.put<string>(api + "api/discount", { id, code, description, percentage, minAmount, active });
        } catch (error) {
            handleError(error);
        }
    },

    deleteDiscount: async (id: number) => {
        try {
            return await axios.delete<string>(api + "api/discount", { data: { id } });
        } catch (error) {
            handleError(error);
        }
    },
};