import { createContext, useEffect, useState } from "react";
import type { UserProfile } from "../models/User";
import {loginAPI, registerAPI, testLoginAPI} from "../services/AuthService";
import { Bounce, Slide, toast } from "react-toastify";
import React from "react";
import axios from "axios";
import type {UserType} from "../enums/UserType.ts";
import {bool} from "yup";
import type {BasicResponse} from "../models/BasicResponse.ts";

type UserContextType = {
    user: UserProfile | null;
    token: string | null;
    registerUser: (username: string, email: string, password: string,
                   userType: UserType) => void;
    loginUser: (email: string, password: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
    isAdmin: () => boolean;
}

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({children} : Props) => {
    // const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isReady, setIsReady] = useState(false);
    const loginCheck = async (): Promise<boolean> => {
        const res = await testLoginAPI();
        return res?.data === "Success";
    };

    useEffect(() => {
        const initAuth = async () => {
            const user = localStorage.getItem("user");
            const token = localStorage.getItem("token");

            if (!token) {
                setIsReady(true);
                return;
            }

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const success = await loginCheck();

            if (user && success) {
                setUser(JSON.parse(user));
                setToken(token);
            } else {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                delete axios.defaults.headers.common["Authorization"];
            }

            setIsReady(true);
        };

        initAuth();
    }, []);

    const registerUser =
        async (username: string, email: string, password: string,
               userType: UserType) => {
        await registerAPI(username, email, password, userType)
            .then((res) => {
            if(res) {
                const response: BasicResponse = {
                    success: res?.data.success,
                    error: res?.data?.error,
                }
                console.log("HERE")
                console.log(res);
                if (response.success) {
                    loginUser(email, password);
                }
                else {
                    toast.error(response.error, {
                        hideProgressBar: true,
                        closeOnClick: true,
                        transition: Bounce,
                        position: "bottom-right",
                    })
                }
            }
        }).catch((e) => toast.warning("Server error occured", {
                    hideProgressBar: true,
                    closeOnClick: true,
                    transition: Bounce,
                    position: "bottom-right",
                }))
    }

    const loginUser = async (email: string, password: string) => {
        try {
            const res = await loginAPI(email, password);
            if (res && res.data.success) {
                const newToken = res.data.token;

                // 1. Set global Axios header immediately for the active session
                axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

                // 2. Persist to storage and state
                localStorage.setItem("token", newToken);
                const userObj: UserProfile = {
                    username: res.data.username,
                    email: email,
                    role: res.data.role,
                    guideId: res.data.guideId,
                };
                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(newToken);
                setUser(userObj);

                toast.success("Login Success", {
                    hideProgressBar: true,
                    closeOnClick: true,
                    transition: Slide,
                    position: "bottom-right",
                });
            } else {
                toast.error("Login Failed", {
                    hideProgressBar: true,
                    closeOnClick: true,
                    transition: Slide,
                    position: "bottom-right",
                });
            }
        } catch (e) {
            toast.warning("Server error occurred", {
                hideProgressBar: true,
                closeOnClick: true,
                transition: Bounce,
                position: "bottom-right",
            });
        }
    };

    const isLoggedIn = () => {
        return !!user;
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user")
        setUser(null)
        setToken("")
        // navigate("/")
    }

    const isAdmin = () => {
        return (user?.role == "AGENCYSTAFF") || (user?.role == "TOURMANAGER");
    }

    return (
        <UserContext.Provider value={{loginUser, user, token, logout, isLoggedIn, isAdmin, registerUser}}>
            {isReady ? children : null}
        </UserContext.Provider>
    )
}

export const useAuth = () => React.useContext(UserContext);

