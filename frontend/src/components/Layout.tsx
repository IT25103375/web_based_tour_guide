import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    AppBar,
    Typography,
    IconButton,
    Avatar,
    Divider,
    Tooltip,
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    BookOnline,
    Event,
    Search,
    AdminPanelSettings,
    Logout,
    TravelExplore,
    Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {useAuth} from "@/context/useAuth.tsx";

const DRAWER_WIDTH = 240;

const navItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { label: "Book a Tour", icon: <BookOnline />, path: "/booking" },
    { label: "Book Events", icon: <Event />, path: "/events" },
    { label: "Search Destinations", icon: <Search />, path: "/destinations" },
    { label: "Admin Panel", icon: <AdminPanelSettings />, path: "/admin" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const {logout, user} = useAuth();

    const drawerContent = (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Toolbar sx={{ gap: 1.5, px: 2 }}>
                <TravelExplore sx={{ color: "#D4A017", fontSize: 28 }} />
                <Box>
                    <Typography variant="subtitle1" sx={{ color: "#fff", lineHeight: 1.2, fontWeight: 700 }}>
                        Ceylon Tours
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.65rem" }}>
                        Web Based Tour Guide
                    </Typography>
                </Box>
            </Toolbar>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
            <List sx={{ flex: 1, pt: 1 }}>
                {navItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
                            <ListItemButton
                                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                                sx={{
                                    mx: 1,
                                    borderRadius: 2,
                                    color: active ? "#D4A017" : "rgba(255,255,255,0.75)",
                                    backgroundColor: active ? "rgba(212,160,23,0.15)" : "transparent",
                                    "&:hover": { backgroundColor: "rgba(255,255,255,0.08)", color: "#fff" },
                                    transition: "all 0.15s",
                                }}
                            >
                                <ListItemIcon sx={{ color: "inherit", minWidth: 38 }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontSize: "0.875rem", fontWeight: active ? 600 : 400 } } }} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
            <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: "#D4A017", fontSize: "0.8rem" }}>KP</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ color: "#fff", fontWeight: 500, lineHeight: 1.2 }}>{user?.username}</Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem" }}>{user?.role}</Typography>
                </Box>
                <Tooltip title="Sign out">
                    <IconButton size="small" sx={{ color: "rgba(255,255,255,0.5)", "&:hover": { color: "#fff" } }} onClick={() => {
                        logout();
                        navigate("/")}}>
                        <Logout fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    display: { sm: "none" },
                    bgcolor: "#1B4332",
                    width: "100%",
                    zIndex: (t) => t.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    <IconButton color="inherit" onClick={() => setMobileOpen(!mobileOpen)}>
                        <MenuIcon />
                    </IconButton>
                    <TravelExplore sx={{ color: "#D4A017", ml: 1, mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Ceylon Tours</Typography>
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}
                >
                    {drawerContent}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flex: 1,
                    width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
                    pt: { xs: 8, sm: 0 },
                    minHeight: "100vh",
                    overflow: "auto",
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
