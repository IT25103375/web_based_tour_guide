import { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, Stack, Typography } from "@mui/material";
import { People } from "@mui/icons-material";
import { bookingAPI } from "../services/BookingService";
import { guideAPI } from "../services/GuideService";
import type { Booking } from "../models/Booking";
import type { Guide } from "../models/User";
import RatingSection from "./RatingSection";

export default function AssignedGuides() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    let active = true;
    bookingAPI.getMyBookings()
      .then((res) => {
        if (!active) return;
        if (res) setBookings(res.data ?? []);
        else setError("Could not load your bookings and assigned guides.");
      })
      .catch(() => { if (active) setError("Could not load your bookings and assigned guides."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

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
    <Box sx={{ mt: 3 }}>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>My bookings & assigned guides</Typography>
      {loading && <CircularProgress size={24} aria-label="Loading bookings" />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (bookings.length ? (
        <Stack spacing={1}>
          {bookings.map((booking) => (
            <Box key={booking.bookingId} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, p: 1.5, bgcolor: "background.default", borderRadius: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{booking.packageName}</Typography>
                <Typography variant="caption" color="text.secondary">{new Date(booking.bookedDate).toLocaleDateString()} · {booking.status}</Typography>
              </Box>
              {booking.guideId != null ? (
                <Button size="small" startIcon={<People />} onClick={() => showGuide(booking.guideId!)}>
                  {booking.guideName || "View guide"}
                </Button>
              ) : <Typography variant="caption" color="text.secondary">Guide not assigned yet</Typography>}
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
