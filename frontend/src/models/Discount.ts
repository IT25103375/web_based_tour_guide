import {DiscountPriceType} from "@/enums/DiscountPriceType.ts";
import {DiscountTimeType} from "@/enums/DiscountTimeType.ts";

export interface Discount {
    id: number;
    couponCode?: string;
    percentage?: number;
    fixed?: number;
    minAmount: number;
    discountPriceType: DiscountPriceType;
    discountTimeType: DiscountTimeType;
    startDate: string; // ISO instant
    endDate: string; // ISO instant
    applicablePackagesIds?: number[];
}

export type DiscountList = Discount[] | null