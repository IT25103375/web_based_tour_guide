import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { TravelExplore, Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth.tsx";
import { UserType } from "@/enums/UserType.ts";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState<UserType>(UserType.Tourist);
  const [error, setError] = useState("");
  const { registerUser, isLoggedIn } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    registerUser(username, email, password, type);
  };

  useEffect(() => {
    if (isLoggedIn()) navigate("/dashboard");
  }, [isLoggedIn, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#F7F4EF",
        backgroundImage: `linear-gradient(rgba(27,67,50,0.72), rgba(27,67,50,0.72)),
          url('https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=1600&h=900&fit=crop&auto=format')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          m: "auto",
          width: "100%",
          maxWidth: 420,
          px: 2,
        }}
      >
        <Card elevation={0} sx={{ borderRadius: 3, overflow: "visible" }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <TravelExplore sx={{ color: "#1B4332", fontSize: 36 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#1B4332" }}>
                  Ceylon Tours
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Create an account to continue
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                size="small"
                autoComplete="username"
              />
              <TextField
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                size="small"
                autoComplete="email"
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                size="small"
                autoComplete="new-password"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <FormControl fullWidth size="small">
                <InputLabel id="user-type-select-label">Account Type</InputLabel>
                <Select
                  labelId="user-type-select-label"
                  label="Account Type"
                  value={type}
                  onChange={(e) => setType(e.target.value as UserType)}
                >
                  <MenuItem value={UserType.Tourist}>Tourist</MenuItem>
                  <MenuItem value={UserType.TourGuide}>Tour Guide</MenuItem>
                </Select>
              </FormControl>

              <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 0.5, py: 1.2 }}>
                Register
              </Button>
            </Box>

            <Box sx={{ mt: 2.5, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Have an account?{" "}
                <Typography
                  onClick={() => navigate("/login")}
                  component="span"
                  variant="body2"
                  sx={{ color: "primary.main", cursor: "pointer", fontWeight: 600 }}
                >
                  Log in
                </Typography>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}