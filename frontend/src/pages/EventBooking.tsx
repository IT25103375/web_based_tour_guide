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
import { Close, CheckCircle, CalendarMonth, Group } from "@mui/icons-material";
import { useState } from "react";
import Layout from "../components/Layout";
import { tourPackages, events } from "../data/mockData";

interface EventItem {
  id: number;
  packageId: number;
  name: string;
  description: string;
  price: number;
  date: string;
  capacity: number;
}

export default function EventBooking() {
  const [selectedPackageId, setSelectedPackageId] = useState<number | "">("");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const filteredEvents = selectedPackageId
    ? events.filter((e) => e.packageId === selectedPackageId)
    : [];

  const handleClose = () => {
    setSelectedEvent(null);
    setConfirmed(false);
  };

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Book an Event</Typography>
          <Typography variant="body2" color="text.secondary">
            Select a tour package first to see its available events
          </Typography>
        </Box>

        <FormControl sx={{ mb: 3, minWidth: 320 }} size="small">
          <InputLabel>Select Tour Package</InputLabel>
          <Select
            label="Select Tour Package"
            value={selectedPackageId}
            onChange={(e) => setSelectedPackageId(e.target.value as number)}
          >
            {tourPackages.map((pkg) => (
              <MenuItem key={pkg.id} value={pkg.id}>
                {pkg.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {!selectedPackageId && (
          <Alert severity="info" sx={{ maxWidth: 480 }}>
            Choose a tour package above to see its associated events.
          </Alert>
        )}

        {selectedPackageId && filteredEvents.length === 0 && (
          <Alert severity="warning" sx={{ maxWidth: 480 }}>
            No events are currently available for this package.
          </Alert>
        )}

        <Grid container spacing={2}>
          {filteredEvents.map((ev) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ev.id}>
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
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>{ev.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: "0.82rem" }}>
                    {ev.description}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarMonth sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary">{ev.date}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Group sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary">
                        Up to {ev.capacity} guests
                      </Typography>
                    </Box>
                  </Box>
                  <Button variant="contained" size="small" fullWidth onClick={() => setSelectedEvent(ev)}>
                    Book Event
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Booking confirmation dialog */}
        <Dialog open={!!selectedEvent} onClose={handleClose} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {confirmed ? "Booking Confirmed" : "Confirm Event Booking"}
            <IconButton size="small" onClick={handleClose}><Close fontSize="small" /></IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {!confirmed ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {selectedEvent && (
                  <Box sx={{ p: 1.5, bgcolor: "#F7F4EF", borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{selectedEvent.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{selectedEvent.description}</Typography>
                  </Box>
                )}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">Date</Typography>
                    <Typography variant="body2">{selectedEvent?.date}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">Capacity</Typography>
                    <Typography variant="body2">{selectedEvent?.capacity} guests</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main" }}>
                    LKR {selectedEvent?.price.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <CheckCircle sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Event Booked!</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  You're registered for <strong>{selectedEvent?.name}</strong> on <strong>{selectedEvent?.date}</strong>.
                </Typography>
                <Chip label={`Ref #EV-${String(Date.now()).slice(-5)}`} color="primary" />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose} color="inherit">{confirmed ? "Close" : "Cancel"}</Button>
            {!confirmed && (
              <Button variant="contained" onClick={() => setConfirmed(true)}>
                Pay LKR {selectedEvent?.price.toLocaleString()}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
