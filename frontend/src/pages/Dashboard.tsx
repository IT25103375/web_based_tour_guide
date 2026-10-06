import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Avatar,
} from "@mui/material";
import {
  BookOnline,
  Event,
  People,
  AttachMoney,
  ArrowForward,
  Explore,
  ConfirmationNumber,
  Star,
  CalendarMonth,
  Translate,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {useAuth} from "@/context/useAuth.tsx";
import {useEffect, useState, type ReactNode} from "react";
import {tourPackageAPI} from "@/services/TourPackageService.tsx";
import {TourPackage} from "@/models/TourPackage.ts";
import {Package} from "@/pages/Booking.tsx";
import AssignedGuides from "@/components/AssignedGuides.tsx";
import {userAdminAPI} from "@/services/UserAdminService.tsx";
import {eventAPI} from "@/services/EventService.tsx";
import {supportAPI} from "@/services/SupportService.tsx";
import {guideAPI} from "@/services/GuideService.tsx";
import {bookingAPI} from "@/services/BookingService.tsx";
import type {Ticket} from "@/models/Ticket.ts";
import type {Booking} from "@/models/Booking.ts";

interface StatCard {
  label: string;
  value: string;
  icon: ReactNode;
  color: string;
}

// Safely unwraps an axios response (undefined when the request failed) into a list
const listOf = <T,>(res?: { data?: unknown }): T[] => {
  const data = res?.data;
  return Array.isArray(data) ? (data as T[]) : [];
};

export default function Dashboard() {
  const [tourPackages, setTourPackages] = useState<Package[]>([]);
  const navigate = useNavigate();
  const {user, isAdmin, isTourist} = useAuth();
  const tourist = isTourist();
  const admin = isAdmin();
  const [liveStats, setLiveStats] = useState<StatCard[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(tourist);
  const [bookingsError, setBookingsError] = useState("");

  // Tourist figures come from their own bookings and tickets
  const loadTouristData = () => {
    setBookingsLoading(true);
    return Promise.all([bookingAPI.getMyBookings(), supportAPI.getTickets()])
      .then(([bookingsRes, ticketsRes]) => {
        const list = listOf<Booking>(bookingsRes);
        setBookings(list);
        setBookingsError(bookingsRes ? "" : "Could not load your bookings.");

        const now = Date.now();
        const active = list.filter((b) => b.status === "BOOKED");
        const next = active
            .filter((b) => new Date(b.bookedDate).getTime() > now)
            .sort((a, b) => new Date(a.bookedDate).getTime() - new Date(b.bookedDate).getTime())[0];
        const spent = list
            .filter((b) => b.status === "BOOKED" || b.status === "FINISHED")
            .reduce((sum, b) => sum + (b.finalPrice ?? 0), 0);
        const openTickets = listOf<Ticket>(ticketsRes).filter((t) => t.status !== "SOLVED").length;

        setLiveStats([
          { label: "Active Bookings", value: String(active.length), icon: <BookOnline />, color: "#1B4332" },
          { label: "Next Tour", value: next ? new Date(next.bookedDate).toLocaleDateString() : "None booked", icon: <Event />, color: "#D4A017" },
          { label: "Total Spent (LKR)", value: spent.toLocaleString(), icon: <AttachMoney />, color: "#A67C00" },
          { label: "Open Tickets", value: String(openTickets), icon: <ConfirmationNumber />, color: "#2D6A4F" },
        ]);
      })
      .finally(() => setBookingsLoading(false));
  };

  // Everyone gets real figures: tourists their own, admins system-wide, guides their profile
  useEffect(() => {
    if (tourist) {
      void loadTouristData();
      return;
    }
    if (admin) {
      Promise.all([
        userAdminAPI.getUsers(),
        eventAPI.getAllEventsAdmin(),
        supportAPI.getAllTickets(),
        tourPackageAPI.getPackages(),
      ]).then(([users, events, tickets, pkgs]) => {
        const open = listOf<Ticket>(tickets).filter((t) => t.status !== "SOLVED").length;
        setLiveStats([
          { label: "Tour Packages", value: String(listOf(pkgs).length), icon: <Explore />, color: "#1B4332" },
          { label: "Events", value: String(listOf(events).length), icon: <Event />, color: "#D4A017" },
          { label: "Registered Users", value: String(listOf(users).length), icon: <People />, color: "#2D6A4F" },
          { label: "Open Tickets", value: String(open), icon: <ConfirmationNumber />, color: "#A67C00" },
        ]);
      });
    } else if (user?.guideId != null) {
      guideAPI.getGuide(user.guideId).then((res) => {
        const g = res?.data;
        if (!g) return;
        const status = g.status.charAt(0) + g.status.slice(1).toLowerCase();
        setLiveStats([
          { label: "Status", value: status, icon: <CheckCircle />, color: "#1B4332" },
          { label: "Average Rating", value: (g.avgRating ?? 0).toFixed(1), icon: <Star />, color: "#D4A017" },
          { label: "Working Days", value: String(g.activeDays?.length ?? 0), icon: <CalendarMonth />, color: "#2D6A4F" },
          { label: "Languages", value: g.languages?.length ? g.languages.join(", ") : "None set", icon: <Translate />, color: "#A67C00" },
        ]);
      });
    }
  }, [tourist, admin, user?.guideId]);


  useEffect(() => {
    tourPackageAPI.getPackages().then((res) => {
      const data = res?.data;
      if (Array.isArray(data) && data.length > 0) {
        setTourPackages(
            data.map((pkg: TourPackage, i: number) => ({
              id: pkg.id,
              name: pkg.displayName,
              destination: pkg.offeredDestinationNames ? pkg.offeredDestinationNames.join(", ") : "",
              price: pkg.price,
              duration: pkg.duration.toString(),
              description: pkg.description,
              image: "",
              maxCapacity: pkg.capacity,
              rating: pkg.avgRating,
            }))
        );
      }
    });
  }, []);

  return (
      <Layout>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
              Welcome back, {user?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tourist
                  ? "Here's what's happening with your tours today."
                  : admin
                      ? "Here's an overview of the system."
                      : "Here's an overview of your guide profile."}
            </Typography>
          </Box>

          {/* Stat cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {liveStats.map((s) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.label}>
                  <Card elevation={0} sx={{ border: "1px solid #E8E0D5" }}>
                    <CardContent sx={{ display: "flex", alignItems: "flex-start", gap: 2, p: 2.5, "&:last-child": { pb: 2.5 } }}>
                      <Avatar sx={{ bgcolor: s.color, width: 44, height: 44 }}>{s.icon}</Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>{s.value}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>{s.label}</Typography>

                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
            ))}
          </Grid>

          <Grid container spacing={2}>
            {/* Recent Bookings (tourists only; the bookings API is tourist-only) */}
            {tourist && (
            <Grid size={{ xs: 12, lg: 8 }}>
              <Card elevation={0} sx={{ border: "1px solid #E8E0D5" }}>
                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6">My Bookings</Typography>
                    <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate("/booking")}>
                      Book new
                    </Button>
                  </Box>
                  <AssignedGuides
                    bookings={bookings}
                    loading={bookingsLoading}
                    error={bookingsError}
                    onCancelled={loadTouristData}
                  />
                </CardContent>
              </Card>
            </Grid>
            )}

            {/* Popular Packages */}
            <Grid size={{ xs: 12, lg: tourist ? 4 : 12 }}>
              <Card elevation={0} sx={{ border: "1px solid #E8E0D5", height: "100%" }}>
                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6">Tour Packages</Typography>
                    <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate("/booking")}>
                      View all
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {tourPackages.slice(0, tourist ? 4 : 6).map((pkg) => (
                        <Box
                            key={pkg.id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              p: 1.5,
                              borderRadius: 2,
                              border: "1px solid #E8E0D5",
                              cursor: "pointer",
                              "&:hover": { bgcolor: "#FAFAF8" },
                            }}
                            onClick={() => navigate("/booking")}
                        >
                          {pkg.image && (
                            <Box
                                component="img"
                                src={pkg.image}
                                alt={pkg.name}
                                sx={{ width: 48, height: 48, borderRadius: 1.5, objectFit: "cover", flexShrink: 0 }}
                            />
                          )}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }} noWrap>{pkg.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{pkg.duration}</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main", flexShrink: 0 }}>
                            LKR {pkg.price.toLocaleString()}
                          </Typography>
                        </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Layout>
  );
}
