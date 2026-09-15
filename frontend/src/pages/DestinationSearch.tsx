import {
  Box,
  TextField,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Divider,
  InputAdornment,
} from "@mui/material";
import { Search, Close, ArrowForward, LocationOn, WbSunny } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { destinations, tourPackages } from "../data/mockData";

interface Destination {
  id: number;
  name: string;
  province: string;
  description: string;
  highlights: string[];
  image: string;
  climate: string;
  bestTime: string;
}

export default function DestinationSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Destination | null>(null);

  const results = query.trim().length > 0
    ? destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.province.toLowerCase().includes(query.toLowerCase()) ||
          d.highlights.some((h) => h.toLowerCase().includes(query.toLowerCase()))
      )
    : destinations;

  const packagesForDestination = selected
    ? tourPackages.filter((p) => p.destination === selected.name)
    : [];

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Explore Destinations</Typography>
          <Typography variant="body2" color="text.secondary">Search by name, province, or attraction</Typography>
        </Box>

        <TextField
          fullWidth
          placeholder="Search destinations… e.g. Sigiriya, Southern, Safari"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          sx={{ maxWidth: 520, mb: 3 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            },
          }}
        />

        {results.length === 0 && (
          <Typography color="text.secondary">No destinations match your search.</Typography>
        )}

        <Grid container spacing={2}>
          {results.map((dest) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={dest.id}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #E8E0D5",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.1)" },
                }}
                onClick={() => setSelected(dest)}
              >
                <CardMedia component="img" height="160" image={dest.image} alt={dest.name} />
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.75 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{dest.name}</Typography>
                    <Chip label={dest.province} size="small" variant="outlined" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", mb: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {dest.description}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {dest.highlights.slice(0, 3).map((h) => (
                      <Chip key={h} label={h} size="small" sx={{ bgcolor: "#F0EBE1", fontSize: "0.7rem" }} />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Destination detail dialog */}
        <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
          {selected && (
            <>
              <Box sx={{ position: "relative" }}>
                <Box
                  component="img"
                  src={selected.image}
                  alt={selected.name}
                  sx={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
                />
                <IconButton
                  size="small"
                  onClick={() => setSelected(null)}
                  sx={{ position: "absolute", top: 8, right: 8, bgcolor: "rgba(0,0,0,0.5)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
              <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOn sx={{ color: "primary.main" }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{selected.name}</Typography>
                  <Chip label={selected.province} size="small" variant="outlined" />
                </Box>
              </DialogTitle>
              <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {selected.description}
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <WbSunny sx={{ fontSize: 16, color: "secondary.main" }} />
                    <Typography variant="caption" color="text.secondary">{selected.climate}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">Best time: {selected.bestTime}</Typography>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2.5 }}>
                  {selected.highlights.map((h) => (
                    <Chip key={h} label={h} size="small" sx={{ bgcolor: "#F0EBE1" }} />
                  ))}
                </Box>

                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Available Tour Packages
                </Typography>

                {packagesForDestination.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No packages currently available for this destination.</Typography>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {packagesForDestination.map((pkg) => (
                      <Box
                        key={pkg.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 1.5,
                          border: "1px solid #E8E0D5",
                          borderRadius: 2,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "#FAFAF8" },
                        }}
                        onClick={() => { setSelected(null); navigate("/booking"); }}
                      >
                        <Box component="img" src={pkg.image} alt={pkg.name}
                          sx={{ width: 56, height: 42, borderRadius: 1, objectFit: "cover", flexShrink: 0 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{pkg.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{pkg.duration}</Typography>
                        </Box>
                        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>
                            LKR {pkg.price.toLocaleString()}
                          </Typography>
                          <Chip label={pkg.available ? "Available" : "Full"} color={pkg.available ? "success" : "default"} size="small" />
                        </Box>
                        <ArrowForward sx={{ fontSize: 16, color: "text.secondary" }} />
                      </Box>
                    ))}
                  </Box>
                )}
              </DialogContent>
            </>
          )}
        </Dialog>
      </Box>
    </Layout>
  );
}
