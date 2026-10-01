import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Divider, Rating as Stars, Stack, TextField, Typography } from "@mui/material";
import { supportAPI } from "../services/SupportService";
import type { Rating } from "../models/Rating";
import type { RatingType } from "../enums/RatingType";

export default function RatingSection({ type, typeId }: { type: RatingType; typeId: number }) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setRatings([]);
    setError("");
    setScore(null);
    setMessage("");
    setNotice("");
    supportAPI.getRatings(type, typeId)
      .then((res) => {
        if (!active) return;
        if (res) setRatings(res.data);
        else setError("Could not load reviews. Please try again later.");
      })
      .catch(() => { if (active) setError("Could not load reviews. Please try again later."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [type, typeId]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!score || !message.trim()) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const posted = await supportAPI.postRating({ rating: score, message: message.trim(), type, typeId });
      if (!posted) throw new Error("rating not posted");
      setMessage("");
      setScore(null);
      setNotice("Your review was posted.");
    } catch {
      setError("Could not post your review. Please try again.");
      setSaving(false);
      return;
    }
    try {
      const res = await supportAPI.getRatings(type, typeId);
      if (!res) throw new Error("ratings not refreshed");
      setRatings(res.data);
    } catch {
      setError("Review posted, but the list could not be refreshed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 2 }}>Ratings & comments</Typography>
      {loading && <CircularProgress size={24} aria-label="Loading reviews" />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}
      {!loading && (ratings.length ? (
        <Stack spacing={2} sx={{ mb: 3 }}>
          {ratings.map((entry, index) => (
            <Box key={index} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
              <Stars value={entry.rating} readOnly size="small" />
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{entry.message}</Typography>
            </Box>
          ))}
        </Stack>
      ) : <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>No reviews yet. Be the first to share your experience.</Typography>)}
      <Box component="form" onSubmit={submit} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography variant="subtitle2">Leave a review</Typography>
        <Stars value={score} onChange={(_, value) => setScore(value)} aria-label="Your rating" />
        <TextField label="Your comment" multiline minRows={2} value={message} onChange={(e) => setMessage(e.target.value)} required fullWidth />
        <Button type="submit" variant="contained" disabled={saving || !score || !message.trim()} sx={{ alignSelf: "flex-start" }}>
          {saving ? "Posting…" : "Post review"}
        </Button>
      </Box>
    </Box>
  );
}
