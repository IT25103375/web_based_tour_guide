import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import theme from "./theme";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import EventBooking from "./pages/EventBooking";
import DestinationSearch from "./pages/DestinationSearch";
import AdminPanel from "./pages/AdminPanel";
import Register from "@/pages/Register.tsx";
import {UserProvider} from "@/context/useAuth.tsx";

export default function App() {
    return (
        <UserProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<SignIn />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/booking" element={<Booking />} />
                        <Route path="/events" element={<EventBooking />} />
                        <Route path="/destinations" element={<DestinationSearch />} />
                        <Route path="/admin" element={<AdminPanel />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </UserProvider>
    );
}
