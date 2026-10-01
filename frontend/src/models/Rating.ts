import {RatingType} from "@/enums/RatingType.ts";

export const RATING_MAX : number = 5;

export interface Rating {
    rating: number;
    message: string;
    type: RatingType;
    typeId: number;
}