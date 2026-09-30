import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import {DiscountPriceType} from "@/enums/DiscountPriceType.ts";
import {DiscountTimeType} from "@/enums/DiscountTimeType.ts";
import {Discount, DiscountList} from "@/models/Discount.ts";

const api = "http://localhost:8090/";

export const discountAPI = {
    getDiscounts: async () => {
        try {
            return await axios.get<DiscountList>(api + "api/discount");
        } catch (error) {
            handleError(error);
        }
    },

    addDiscount: async (discount: Omit<Discount, "id">) => {
        try {
            return await axios.post<string>(api + "api/discount", discount);
        } catch (error) {
            handleError(error);
        }
    },

    editDiscount: async (discount: Discount) => {
        try {
            return await axios.put<string>(api + "api/discount", discount);
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