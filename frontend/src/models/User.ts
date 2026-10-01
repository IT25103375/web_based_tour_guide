import type {UserType} from "../enums/UserType.ts";
import {DayOfWeek} from "@/models/DayOfWeek.ts";
import {GuideStatus} from "@/enums/GuideStatus.ts";

// Matches the backend's UserAdminDTO (GET /api/user) used by the admin panel's Users tab.
export type UserGet = {
    id: number;
    username: string;
    email: string;
    userType: UserType;
}

//TODO: Remove username and password fields, get email from auth object
export type UserPost = {
    username : string;
    email : string;
    password : string;
    userType: UserType;
}

export type UserProfileToken = {
    email: string;
    username: string;
    token: string;
    role: UserType;
    success: boolean;
}

export type UserProfile = {
    email: string;
    username: string;
    role: UserType;
}

export type Guide = {
    id: number;
    name: string;
    activeDays: DayOfWeek[]; // serialised as a JSON array
    status: GuideStatus;
    languages: string[];
    avgRating: number;
}