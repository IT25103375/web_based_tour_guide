import { useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { People } from "@mui/icons-material";
import { bookingAPI } from "../services/BookingService";
import { guideAPI } from "../services/GuideService";
import type { Booking } from "../models/Booking";
import type { Guide } from "../models/User";
import RatingSection from "./RatingSection";

interface Props {
  bookings: Booking[];
  loading: boolean;
  error: string;
  // Called after a booking was cancelled so the parent can reload its data
  onCancelled: () => void;
}

export default function AssignedGuides({ bookings, loading, error, onCancelled }: Props) {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [open, setOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const canCancel = (booking: Booking) =>
    booking.status === "BOOKED" && new Date(booking.bookedDate).getTime() > Date.now();

  async function cancel(booking: Booking) {
    if (!window.confirm(`Cancel your booking for ${booking.packageName}?`)) return;
    setCancellingId(booking.bookingId);
    // handleError already toasts failures and returns undefined
    const res = await bookingAPI.cancelTour(booking.bookingId);
    setCancellingId(null);
    if (res) onCancelled();
  }

  async function showGuide(id: number) {
    setGuide(null);
    setProfileError("");
    setProfileLoading(true);
    setOpen(true);
    try {
      const res = await guideAPI.getGuide(id);
      if (!res) throw new Error("guide not loaded");
      setGuide(res.data);
    } catch {
      setProfileError("Could not load this guide's profile.");
    } finally {
      setProfileLoading(false);
    }
  }

  return (
    <Box>
      {loading && <CircularProgress size={24} aria-label="Loading bookings" />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (bookings.length ? (
        <Stack spacing={1}>
          {bookings.map((booking) => (
            <Box key={booking.bookingId} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, p: 1.5, bgcolor: "background.default", borderRadius: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{booking.packageName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(booking.bookedDate).toLocaleDateString()} · LKR {booking.finalPrice?.toLocaleString()}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                <Chip
                  size="small"
                  variant="outlined"
                  label={booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                  color={booking.status === "BOOKED" ? "success" : booking.status === "CANCELLED" ? "error" : "default"}
                />
                {booking.guideId != null ? (
                  <Button size="small" startIcon={<People />} onClick={() => showGuide(booking.guideId!)}>
                    {booking.guideName || "View guide"}
                  </Button>
                ) : <Typography variant="caption" color="text.secondary">Guide not assigned yet</Typography>}
                {canCancel(booking) && (
                  <Button size="small" color="error" onClick={() => cancel(booking)} disabled={cancellingId === booking.bookingId}>
                    Cancel
                  </Button>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : <Typography variant="body2" color="text.secondary">No bookings yet.</Typography>)}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Guide profile</DialogTitle>
        <DialogContent dividers>
          {profileLoading && <CircularProgress size={24} aria-label="Loading guide" />}
          {profileError && <Alert severity="error">{profileError}</Alert>}
          {guide && (
            <>
              <Typography variant="h6">{guide.name}</Typography>
              <Stack direction="row" spacing={1} sx={{ my: 1, flexWrap: "wrap" }}>
                <Chip label={guide.status} size="small" color="primary" variant="outlined" />
                <Chip label={`${guide.avgRating ?? 0} / 5 rating`} size="small" color="secondary" variant="outlined" />
              </Stack>
              <Typography variant="body2" color="text.secondary">Languages: {guide.languages?.join(", ") || "Not listed"}</Typography>
              <Typography variant="body2" color="text.secondary">Available: {guide.activeDays?.join(", ") || "Not listed"}</Typography>
              <RatingSection type="TOURGUIDE" typeId={guide.id} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
