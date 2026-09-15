import type {UserType} from "../enums/UserType.ts";

export type UserGet = {
    username: string;
    ID : number;
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