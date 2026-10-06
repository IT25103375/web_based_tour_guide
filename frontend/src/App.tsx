import { ThemeProvider, CssBaseline } from "@mui/material";
import {BrowserRouter, Routes, Route, Navigate, Outlet} from "react-router-dom";
import {useAuth} from "@/context/useAuth.tsx";
import theme from "./theme";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import EventBooking from "./pages/EventBooking";
import DestinationSearch from "./pages/DestinationSearch";
import AdminPanel from "./pages/AdminPanel";
import Register from "@/pages/Register.tsx";
import {UserProvider} from "@/context/useAuth.tsx";
import Tickets from "@/pages/Tickets.tsx";
import {ToastContainer} from "react-toastify";

// Guards a group of routes by role; anyone else is sent back to the dashboard
function RoleRoute({ allow }: { allow: "tourist" | "admin" }) {
    const { isAdmin, isTourist } = useAuth();
    const permitted = allow === "admin" ? isAdmin() : isTourist();
    return permitted ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

export default function App() {

    function ProtectedRoute() {
        const { isLoggedIn } = useAuth();

        if (!isLoggedIn || !isLoggedIn()) {
            return <Navigate to="/" replace />;
        }

        return <Outlet />;
    }

    return (
        <UserProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<SignIn />} />
                        <Route path="/register" element={<Register />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/booking" element={<Booking />} />
                            <Route element={<RoleRoute allow="tourist" />}>
                                <Route path="/events" element={<EventBooking />} />
                            </Route>
                            <Route path="/destinations" element={<DestinationSearch />} />
                            <Route element={<RoleRoute allow="admin" />}>
                                <Route path="/admin" element={<AdminPanel />} />
                            </Route>
                            <Route path="/tickets" element={<Tickets />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
                <ToastContainer position="bottom-right"/>
            </ThemeProvider>
        </UserProvider>
    );
}
