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
  Alert, MenuItem, Select,
} from "@mui/material";
import { TravelExplore, Visibility, VisibilityOff } from "@mui/icons-material";
import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {UserType} from "@/enums/UserType.ts";
import {useAuth} from "@/context/useAuth.tsx";

export default function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {loginUser, isLoggedIn} = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    loginUser(email, password);
  };

  useEffect(() => {
    if (isLoggedIn()) navigate("/dashboard")
  }, [isLoggedIn()]);

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
                Sign in to your account to continue
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
                autoComplete="current-password"
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
              <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 0.5, py: 1.2 }}>
                Log in
              </Button>
            </Box>

            <Box sx={{ mt: 2.5, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Typography onClick={() => navigate("/register")} component="span" variant="body2" sx={{ color: "primary.main", cursor: "pointer", fontWeight: 600 }}>
                  Register
                </Typography>
              </Typography>
            </Box>

            <Box sx={{ mt: 2, p: 1.5, bgcolor: "#F7F4EF", borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5, fontWeight: 600 }}>
                Demo credentials
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                Email: kasun@example.com &nbsp;|&nbsp; Password: any
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
