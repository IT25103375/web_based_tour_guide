import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Alert,
    Chip,
    Divider,
} from "@mui/material";
import { Close, CheckCircle, CalendarMonth, Group, Place } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { eventAPI } from "../services/EventService";
import { bookingAPI } from "@/services/BookingService.tsx";
import type { Booking } from "@/models/Booking.ts";
import type { EventDetails } from "@/models/EventDetails.ts";
import RatingSection from "@/components/RatingSection.tsx";
import AverageRating from "@/components/AverageRating.tsx";

const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

export default function EventBooking() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingsLoaded, setBookingsLoaded] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<number | "">("");
    const [events, setEvents] = useState<EventDetails[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
    const [registering, setRegistering] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    // Events can only be added to an active (booked) tour
    const activeBookings = bookings.filter((b) => b.status === "BOOKED");
    const selectedBooking = activeBookings.find((b) => b.bookingId === selectedBookingId) ?? null;

    const loadBookings = () =>
        bookingAPI.getMyBookings().then((res) => {
            if (Array.isArray(res?.data)) setBookings(res.data);
            setBookingsLoaded(true);
        });

    const loadEvents = (packageId: number) =>
        eventAPI.getEventsByPackage(packageId).then((res) => {
            // Always replace the list, so switching to a package without events clears the old ones
            setEvents(Array.isArray(res?.data) ? res.data : []);
        });

    useEffect(() => {
        void loadBookings();
    }, []);

    useEffect(() => {
        if (!selectedBooking) {
            setEvents([]);
            return;
        }
        void loadEvents(selectedBooking.packageId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBookingId]);

    const handleClose = () => {
        setSelectedEvent(null);
        setConfirmed(false);
    };

    const handleRegister = async () => {
        if (!selectedEvent || !selectedBooking) return;
        setRegistering(true);
        // handleError already toasts failures and returns undefined, so only confirm on success
        const res = await eventAPI.registerEvent(selectedEvent.eventId, selectedBooking.bookingId);
        setRegistering(false);
        if (res) {
            setConfirmed(true);
            // Refresh so the registration and the remaining spots show up
            void loadBookings();
            void loadEvents(selectedBooking.packageId);
        }
    };

    return (
        <Layout>
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>Book an Event</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Select one of your bookings to see the events offered with its tour package
                    </Typography>
                </Box>

                <FormControl sx={{ mb: 3, minWidth: 320 }} size="small">
                    <InputLabel>Select Booking</InputLabel>
                    <Select
                        label="Select Booking"
                        value={selectedBookingId}
                        onChange={(e) => setSelectedBookingId(e.target.value as number)}
                    >
                        {activeBookings.map((b) => (
                            <MenuItem key={b.bookingId} value={b.bookingId}>
                                {b.packageName} · {formatDate(b.bookedDate)}{b.eventId ? " (event registered)" : ""}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {bookingsLoaded && activeBookings.length < 1 && (
                    <Alert severity="warning" sx={{ maxWidth: 480 }}>
                        Book a tour first to register for an event
                    </Alert>
                )}

                {activeBookings.length > 0 && !selectedBooking && (
                    <Alert severity="info" sx={{ maxWidth: 480 }}>
                        Choose a booking above to see the events available for it.
                    </Alert>
                )}

                {selectedBooking && events.length === 0 && (
                    <Alert severity="warning" sx={{ maxWidth: 480 }}>
                        No events are currently available for this package.
                    </Alert>
                )}

                <Grid container spacing={2}>
                    {events.map((ev) => {
                        const registered = selectedBooking?.eventId === ev.eventId;
                        const full = ev.availableSpots === 0;
                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ev.eventId}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        border: "1px solid #E8E0D5",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        transition: "box-shadow 0.2s",
                                        "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.1)" },
                                    }}
                                >
                                    <CardContent sx={{ flex: 1, p: 2.5 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                                            <Chip label="Event" size="small" color="secondary" />
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                                                LKR {ev.price.toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>{ev.displayName}</Typography>
                                        <Box sx={{ mb: 1 }}><AverageRating value={ev.avgRating} /></Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: "0.82rem" }}>
                                            {ev.description}
                                        </Typography>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mb: 2 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Place sx={{ fontSize: 16, color: "text.secondary" }} />
                                                <Typography variant="caption" color="text.secondary">{ev.location}</Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <CalendarMonth sx={{ fontSize: 16, color: "text.secondary" }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDate(ev.startDate)} – {formatDate(ev.endDate)}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Group sx={{ fontSize: 16, color: "text.secondary" }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {ev.availableSpots != null
                                                        ? `${ev.availableSpots} of ${ev.capacity} spots left`
                                                        : "No guest limit"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            fullWidth
                                            disabled={registered || full}
                                            onClick={() => setSelectedEvent(ev)}
                                        >
                                            {registered ? "Registered" : full ? "Full" : "Register"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Registration confirmation dialog */}
                <Dialog open={!!selectedEvent} onClose={handleClose} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {confirmed ? "Registration Confirmed" : "Confirm Event Registration"}
                        <IconButton size="small" onClick={handleClose}><Close fontSize="small" /></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        {!confirmed ? (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {selectedEvent && (
                                    <Box sx={{ p: 1.5, bgcolor: "#F7F4EF", borderRadius: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{selectedEvent.displayName}</Typography>
                                        <Typography variant="caption" color="text.secondary">{selectedEvent.description}</Typography>
                                    </Box>
                                )}
                                {selectedBooking?.eventId && selectedBooking.eventId !== selectedEvent?.eventId && (
                                    <Alert severity="info">This will replace the event already registered on this booking.</Alert>
                                )}
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography variant="body2" color="text.secondary">Booking</Typography>
                                        <Typography variant="body2">{selectedBooking?.packageName}</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography variant="body2" color="text.secondary">Date</Typography>
                                        <Typography variant="body2">
                                            {selectedEvent && `${formatDate(selectedEvent.startDate)} – ${formatDate(selectedEvent.endDate)}`}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography variant="body2" color="text.secondary">Location</Typography>
                                        <Typography variant="body2">{selectedEvent?.location}</Typography>
                                    </Box>
                                </Box>
                                <Divider />
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Price</Typography>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main" }}>
                                        LKR {selectedEvent?.price.toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: "center", py: 3 }}>
                                <CheckCircle sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Event Registered!</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    You're registered for <strong>{selectedEvent?.displayName}</strong>
                                    {selectedEvent && <> ({formatDate(selectedEvent.startDate)} – {formatDate(selectedEvent.endDate)})</>}.
                                </Typography>
                                <Chip label={`Booking #${selectedBooking?.bookingId ?? ""}`} color="primary" />
                            </Box>
                        )}
                        {selectedEvent && <RatingSection type="EVENT" typeId={selectedEvent.eventId} />}
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={handleClose} color="inherit">{confirmed ? "Close" : "Cancel"}</Button>
                        {!confirmed && (
                            <Button variant="contained" onClick={handleRegister} disabled={registering}>
                                Register · LKR {selectedEvent?.price.toLocaleString()}
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
}
