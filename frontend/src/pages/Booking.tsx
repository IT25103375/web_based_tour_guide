import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Divider,
  IconButton,
} from "@mui/material";
import { Close, CheckCircle, LocalOffer } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { tourPackages as mockPackages, discounts } from "../data/mockData";
import { tourPackageAPI } from "../services/TourPackageService";
import { bookingAPI } from "../services/BookingService";

interface Package {
  id: number;
  name: string;
  destination: string;
  price: number;
  duration: string;
  description: string;
  image: string;
  maxCapacity: number;
  available: boolean;
}

export default function Booking() {
  const [tourPackages, setTourPackages] = useState<Package[]>(mockPackages);
  const [selected, setSelected] = useState<Package | null>(null);
  const [date, setDate] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponResult, setCouponResult] = useState<{ valid: boolean; pct: number; msg: string } | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  // Load real packages from the backend; fall back to mock data on failure
  // so the page still demos even if the API is unreachable.
  useEffect(() => {
    tourPackageAPI.getPackages().then((res) => {
      const data = res?.data;
      if (Array.isArray(data) && data.length > 0) {
        setTourPackages(
            data.map((pkg: any, i: number) => ({
              id: pkg.id,
              name: pkg.displayName,
              destination: mockPackages[i % mockPackages.length].destination,
              price: pkg.price,
              duration: mockPackages[i % mockPackages.length].duration,
              description: mockPackages[i % mockPackages.length].description,
              image: mockPackages[i % mockPackages.length].image,
              maxCapacity: mockPackages[i % mockPackages.length].maxCapacity,
              available: true,
            }))
        );
      }
    });
  }, []);

  const discount = couponResult?.valid ? couponResult.pct : 0;
  const total = selected ? Math.round(selected.price * (1 - discount / 100)) : 0;

  const applyCoupon = () => {
    const found = discounts.find((d) => d.code === coupon.toUpperCase() && d.active);
    if (!found) {
      setCouponResult({ valid: false, pct: 0, msg: "Invalid or expired coupon code." });
    } else if (selected && selected.price < found.minAmount) {
      setCouponResult({ valid: false, pct: 0, msg: `Minimum booking amount of LKR ${found.minAmount.toLocaleString()} required.` });
    } else {
      setCouponResult({ valid: true, pct: found.percentage, msg: `${found.percentage}% discount applied!` });
    }
  };

  const handleClose = () => {
    setSelected(null);
    setDate("");
    setCoupon("");
    setCouponResult(null);
    setConfirmed(false);
  };

  const handlePay = () => {
    if (selected) {
      bookingAPI.bookTour(selected.id, date, couponResult?.valid ? coupon.toUpperCase() : undefined);
    }
    setConfirmed(true);
  };

  return (
      <Layout>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Book a Tour Package</Typography>
            <Typography variant="body2" color="text.secondary">Select a package to get started</Typography>
          </Box>

          <Grid container spacing={2}>
            {tourPackages.map((pkg) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pkg.id}>
                  <Card
                      elevation={0}
                      sx={{
                        border: "1px solid #E8E0D5",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "box-shadow 0.2s",
                        "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.1)" },
                        opacity: pkg.available ? 1 : 0.65,
                      }}
                  >
                    <CardMedia
                        component="img"
                        height="180"
                        image={pkg.image}
                        alt={pkg.name}
                        sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flex: 1, p: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3, flex: 1, mr: 1 }}>
                          {pkg.name}
                        </Typography>
                        <Chip
                            label={pkg.available ? "Available" : "Full"}
                            color={pkg.available ? "success" : "default"}
                            size="small"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                        {pkg.destination} · {pkg.duration}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: "0.8rem" }}>
                        {pkg.description}
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                          LKR {pkg.price.toLocaleString()}
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            disabled={!pkg.available}
                            onClick={() => setSelected(pkg)}
                        >
                          Book Now
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
            ))}
          </Grid>

          {/* Booking dialog */}
          <Dialog open={!!selected} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {confirmed ? "Booking Confirmed" : "Confirm Booking"}
              <IconButton size="small" onClick={handleClose}><Close fontSize="small" /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {!confirmed ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {selected && (
                        <Box sx={{ display: "flex", gap: 2, p: 1.5, bgcolor: "#F7F4EF", borderRadius: 2 }}>
                          <Box component="img" src={selected.image} alt={selected.name}
                               sx={{ width: 80, height: 60, borderRadius: 1.5, objectFit: "cover", flexShrink: 0 }} />
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{selected.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{selected.destination} · {selected.duration}</Typography>
                          </Box>
                        </Box>
                    )}

                    <TextField
                        label="Tour Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        fullWidth
                        size="small"
                        slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: new Date().toISOString().split("T")[0] } }}
                    />

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                          label="Coupon Code"
                          value={coupon}
                          onChange={(e) => { setCoupon(e.target.value); setCouponResult(null); }}
                          size="small"
                          fullWidth
                          slotProps={{ input: { startAdornment: <LocalOffer sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} /> } }}
                      />
                      <Button variant="outlined" onClick={applyCoupon} sx={{ flexShrink: 0 }}>Apply</Button>
                    </Box>
                    {couponResult && (
                        <Alert severity={couponResult.valid ? "success" : "error"} sx={{ py: 0.5 }}>
                          {couponResult.msg}
                        </Alert>
                    )}

                    <Divider />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">Package price</Typography>
                        <Typography variant="body2">LKR {selected?.price.toLocaleString()}</Typography>
                      </Box>
                      {discount > 0 && (
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" color="success.main">Discount ({discount}%)</Typography>
                            <Typography variant="body2" color="success.main">
                              - LKR {(selected ? Math.round(selected.price * discount / 100) : 0).toLocaleString()}
                            </Typography>
                          </Box>
                      )}
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main" }}>
                          LKR {total.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
              ) : (
                  <Box sx={{ textAlign: "center", py: 3 }}>
                    <CheckCircle sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Booking Successful!</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Your booking for <strong>{selected?.name}</strong> on <strong>{date || "TBD"}</strong> has been confirmed.
                    </Typography>
                    <Chip label={`Booking #TG-${String(Date.now()).slice(-5)}`} color="primary" />
                  </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={handleClose} color="inherit">
                {confirmed ? "Close" : "Cancel"}
              </Button>
              {!confirmed && (
                  <Button variant="contained" onClick={handlePay} disabled={!date}>
                    Pay LKR {total.toLocaleString()}
                  </Button>
              )}
            </DialogActions>
          </Dialog>
        </Box>
      </Layout>
  );
}