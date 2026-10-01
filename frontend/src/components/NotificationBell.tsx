import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Box, Button, CircularProgress, Divider, IconButton, Popover, Stack, Tooltip, Typography } from "@mui/material";
import { Close, NotificationsOutlined, Refresh } from "@mui/icons-material";
import { notificationAPI } from "../services/NotificationService";
import type { Notification } from "../models/Notification";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationAPI.getPendingNotifications();
      if (!res) throw new Error("notifications not loaded");
      setNotifications(res.data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    const res = await notificationAPI.removeNotification(id);
    if (res) setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearAll = useCallback(async () => {
    const res = await notificationAPI.clearNotifications();
    if (res) setNotifications([]);
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => {
      if (!document.hidden) void refresh();
    }, 60_000);
    const onVisibility = () => { if (!document.hidden) void refresh(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refresh]);

  return (
    <Box sx={{ position: "fixed", top: { xs: 1, sm: 2 }, right: 2, zIndex: (theme) => theme.zIndex.drawer + 2 }}>
      <Tooltip title="Pending notifications">
        <IconButton
          aria-label={`Pending notifications: ${notifications.length}`}
          onClick={(event) => { setAnchor(event.currentTarget); void refresh(); }}
          sx={{ bgcolor: "primary.main", color: "primary.contrastText", boxShadow: 2, "&:hover": { bgcolor: "primary.light" } }}
        >
          <Badge badgeContent={notifications.length} color="secondary" max={99}>
            <NotificationsOutlined />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: { xs: "90vw", sm: 360 }, maxHeight: "70vh", mt: 1 } } }}
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6">Notifications</Typography>
          <Box>
            <Button size="small" onClick={() => void clearAll()} disabled={loading || notifications.length === 0}>Clear all</Button>
            <Button size="small" startIcon={<Refresh />} onClick={() => void refresh()} disabled={loading}>Refresh</Button>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 1 }}>Could not load notifications. Try refreshing.</Alert>}
          {loading && <CircularProgress size={20} aria-label="Loading notifications" />}
          {!loading && !error && notifications.length === 0 && (
            <Typography variant="body2" color="text.secondary">You're all caught up.</Typography>
          )}
          <Stack divider={<Divider flexItem />}>
            {notifications.map((item) => (
              <Box key={item.id} sx={{ py: 1.5, display: "flex", alignItems: "flex-start", gap: 1 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2">{item.title}</Typography>
                  <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>{item.message}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.timestamp ? new Date(item.timestamp).toLocaleString() : ""}
                  </Typography>
                </Box>
                <IconButton size="small" aria-label="Dismiss notification" onClick={() => void remove(item.id)}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Box>
      </Popover>
    </Box>
  );
}
