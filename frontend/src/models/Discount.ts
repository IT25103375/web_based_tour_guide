import {DiscountPriceType} from "@/enums/DiscountPriceType.ts";
import {DiscountTimeType} from "@/enums/DiscountTimeType.ts";
import {TourPackage} from "@/models/TourPackage.ts";

export interface Discount {
    id: number;
    couponCode?: string;
    percentage?: number;
    fixed?: number;
    discountPriceType: DiscountPriceType;
    discountTimeType: DiscountTimeType;
    startDate: string; // ISO instant
    endDate: string; // ISO instant
}

export type DiscountList = Discount[] | null