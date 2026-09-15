import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import type { UserProfileToken, UserPost } from "../models/User";
import type {UserType} from "../enums/UserType.ts";
import type {BasicResponse} from "../models/BasicResponse.ts";

const api="http://localhost:8090/";

export const loginAPI = async (email: string,password: string) => {
    try{
        return await axios.post<UserProfileToken>(api + "api/user/auth/login", {
            email: email,
            password: password,
        });
    }
    catch(error)
    {
        handleError(error);
    }
}

export const testLoginAPI = async () => {
    try{
        return await axios.get<String>(api + "api/user/auth/test", {
        });
    }
    catch(error)
    {
        handleError(error);
    }
}

export const registerAPI =
    async (username: string, email: string, password: string,
           userType: UserType) => {
    try{
        return await axios.post<BasicResponse>(api + "api/user/auth/register", {
            username: username,
            email: email,
            password: password,
            userType: userType,
        });
    }
    catch(error)
    {
        handleError(error);
    }
}