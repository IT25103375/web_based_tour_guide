import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Avatar,
} from "@mui/material";
import {
  BookOnline,
  Event,
  People,
  AttachMoney,
  TrendingUp,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { recentBookings, tourPackages } from "../data/mockData";
import {useAuth} from "@/context/useAuth.tsx";

const statusColor = (s: string) =>
  s === "Confirmed" ? "success" : s === "Pending" ? "warning" : "error";

const statCards = [
  { label: "Total Bookings", value: "48", icon: <BookOnline />, delta: "+12 this month", color: "#1B4332" },
  { label: "Upcoming Events", value: "7", icon: <Event />, delta: "Next: Oct 5", color: "#D4A017" },
  { label: "Registered Users", value: "124", icon: <People />, delta: "+8 this week", color: "#2D6A4F" },
  { label: "Revenue (LKR)", value: "218,400", icon: <AttachMoney />, delta: "+18% vs last month", color: "#A67C00" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const {user} = useAuth();

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
            Welcome back, {user?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here's what's happening with your tours today.
          </Typography>
        </Box>

        {/* Stat cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {statCards.map((s) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.label}>
              <Card elevation={0} sx={{ border: "1px solid #E8E0D5" }}>
                <CardContent sx={{ display: "flex", alignItems: "flex-start", gap: 2, p: 2.5, "&:last-child": { pb: 2.5 } }}>
                  <Avatar sx={{ bgcolor: s.color, width: 44, height: 44 }}>{s.icon}</Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>{s.value}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>{s.label}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <TrendingUp sx={{ fontSize: 13, color: "success.main" }} />
                      <Typography variant="caption" color="success.main">{s.delta}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2}>
          {/* Recent Bookings */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card elevation={0} sx={{ border: "1px solid #E8E0D5" }}>
              <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">Recent Bookings</Typography>
                  <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate("/booking")}>
                    Book new
                  </Button>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: "text.secondary", borderBottom: "2px solid #E8E0D5" }}>Guest</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "text.secondary", borderBottom: "2px solid #E8E0D5" }}>Package</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "text.secondary", borderBottom: "2px solid #E8E0D5" }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "text.secondary", borderBottom: "2px solid #E8E0D5" }} align="right">Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "text.secondary", borderBottom: "2px solid #E8E0D5" }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentBookings.map((b) => (
                        <TableRow key={b.id} sx={{ "&:hover": { bgcolor: "#FAFAF8" } }}>
                          <TableCell>{b.user}</TableCell>
                          <TableCell sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.package}</TableCell>
                          <TableCell>{b.date}</TableCell>
                          <TableCell align="right">LKR {b.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Chip label={b.status} color={statusColor(b.status)} size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Popular Packages */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card elevation={0} sx={{ border: "1px solid #E8E0D5", height: "100%" }}>
              <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">Tour Packages</Typography>
                  <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate("/booking")}>
                    View all
                  </Button>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {tourPackages.slice(0, 4).map((pkg) => (
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
                      <Box
                        component="img"
                        src={pkg.image}
                        alt={pkg.name}
                        sx={{ width: 48, height: 48, borderRadius: 1.5, objectFit: "cover", flexShrink: 0 }}
                      />
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
