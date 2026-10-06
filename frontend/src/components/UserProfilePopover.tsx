import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Popover,
  Rating,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useAuth } from "@/context/useAuth.tsx";
import { guideAPI } from "@/services/GuideService.tsx";
import type { Guide } from "@/models/User.ts";
import type { DayOfWeek } from "@/enums/DayOfWeek.ts";
import type { GuideStatus } from "@/enums/GuideStatus.ts";

const days: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const languages = ["English", "Sinhala", "Tamil"];

const label = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase();

export default function UserProfilePopover() {
  const { user } = useAuth();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeDays, setActiveDays] = useState<DayOfWeek[]>([]);
  const [status, setStatus] = useState<GuideStatus>("UNAVAILABLE");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  const isGuide = user?.role?.toUpperCase().includes("GUIDE") ?? false;

  function cancelClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setAnchor(null), 180);
  }

  function applyGuide(g: Guide) {
    setGuide(g);
    setActiveDays(g.activeDays ?? []);
    setStatus(g.status);
    setSelectedLanguages(g.languages ?? []);
  }

  async function save() {
    if (!guide || user?.guideId == null) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await guideAPI.updateGuide({ activeDays, status, languages: selectedLanguages });
      if (!res) throw new Error("update failed");
      // Reload so the popover shows exactly what the server stored
      const fresh = await guideAPI.getGuide(user.guideId);
      if (fresh) applyGuide(fresh.data);
      setSaved(true);
    } catch {
      setError("Could not update your profile.");
    } finally {
      setSaving(false);
    }
  }

  async function loadGuide() {
    if (!isGuide || guide || loading) return;
    if (user?.guideId == null) {
      setError("Guide id missing, please sign in again.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await guideAPI.getGuide(user.guideId);
      if (!res) throw new Error("guide not loaded");
      applyGuide(res.data);
    } catch {
      setError("Could not load your profile.");
    } finally {
      setLoading(false);
    }
  }

  function open(event: React.SyntheticEvent<HTMLElement>) {
    cancelClose();
    setAnchor(event.currentTarget);
    void loadGuide();
  }

  useEffect(() => () => cancelClose(), []);

  const displayName = guide?.name || user?.username || "Your profile";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <Box
        tabIndex={0}
        role="button"
        aria-label="Open profile"
        aria-haspopup="dialog"
        onMouseEnter={open}
        onMouseLeave={scheduleClose}
        onFocus={open}
        onClick={open}
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderRadius: 2,
          cursor: "pointer",
          outline: "none",
          "&:focus-visible": { boxShadow: (theme) => `0 0 0 2px ${theme.palette.secondary.main}` },
        }}
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main", fontSize: "body2.fontSize" }}>
          {initials}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: "primary.contrastText", fontWeight: 500, lineHeight: 1.2 }} noWrap>
            {displayName}
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }} noWrap>
            {user?.role ? label(user.role) : "View profile"}
          </Typography>
        </Box>
      </Box>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        disableRestoreFocus
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        sx={{ pointerEvents: "none" }}
        slotProps={{
          paper: {
            onMouseEnter: cancelClose,
            onMouseLeave: scheduleClose,
            sx: {
              pointerEvents: "auto",
              width: { xs: "90vw", sm: 390 },
              ml: 1,
              overflow: "visible",
            },
          },
        }}
      >
        <Paper elevation={0} sx={{ p: 2.5 }}>
          {loading && <CircularProgress size={24} aria-label="Loading profile" />}
          {error && <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert>}
          {saved && <Alert severity="success" sx={{ mb: 1.5 }}>Profile updated.</Alert>}
          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ width: 48, height: 48, bgcolor: "secondary.main" }}>{initials}</Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6" noWrap>{displayName}</Typography>
                {isGuide ? (
                  guide && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <Rating value={guide.avgRating ?? 0} precision={0.1} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary">{(guide.avgRating ?? 0).toFixed(1)}</Typography>
                    </Box>
                  )
                ) : (
                  <Typography variant="body2" color="text.secondary" noWrap>{user?.email}</Typography>
                )}
              </Box>
            </Box>

            {isGuide && guide && (
              <>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Active days</Typography>
                  <ToggleButtonGroup
                    value={activeDays}
                    onChange={(_, values: DayOfWeek[]) => setActiveDays(values)}
                    aria-label="Active days"
                    size="small"
                    sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, "& .MuiToggleButtonGroup-grouped": { borderRadius: 1, border: 1 } }}
                  >
                    {days.map((day) => <ToggleButton key={day} value={day}>{day.slice(0, 3)}</ToggleButton>)}
                  </ToggleButtonGroup>
                </Box>

                <FormControl size="small" fullWidth disabled={guide.status === "BOOKED"}>
                  <InputLabel id="guide-status-label">Status</InputLabel>
                  <Select
                    labelId="guide-status-label"
                    value={status}
                    label="Status"
                    onChange={(event) => setStatus(event.target.value as GuideStatus)}
                  >
                    <MenuItem value="AVAILABLE">Available</MenuItem>
                    <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
                    {/* Shown only while booked; the guide cannot pick or change it */}
                    {guide.status === "BOOKED" && <MenuItem value="BOOKED">Booked</MenuItem>}
                  </Select>
                </FormControl>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Languages</Typography>
                  <ToggleButtonGroup
                    value={selectedLanguages}
                    onChange={(_, values: string[]) => setSelectedLanguages(values)}
                    aria-label="Languages"
                    size="small"
                    sx={{ display: "flex", gap: 0.5, "& .MuiToggleButtonGroup-grouped": { borderRadius: 1, border: 1 } }}
                  >
                    {languages.map((language) => <ToggleButton key={language} value={language}>{language}</ToggleButton>)}
                  </ToggleButtonGroup>
                </Box>

                <Button variant="contained" onClick={save} disabled={saving} sx={{ alignSelf: "flex-start" }}>
                  {saving ? "Saving…" : "Save"}
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      </Popover>
    </>
  );
}
