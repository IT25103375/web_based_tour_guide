import { useEffect, useMemo, useState } from "react";
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Divider, Grid, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
  ToggleButton, ToggleButtonGroup, Typography,
} from "@mui/material";
import { Add, ArrowBack, ArrowForward, CheckCircle, Send } from "@mui/icons-material";
import Layout from "../components/Layout";
import { useAuth } from "@/context/useAuth.tsx";
import { supportAPI } from "../services/SupportService";
import type { Ticket } from "../models/Ticket";
import type { TicketStatus } from "../enums/TicketStatus";

const statusLabels: Record<TicketStatus, string> = {
  AWAITINGRESPONSE: "Awaiting response",
  ONGOING: "Ongoing",
  SOLVED: "Solved",
};

// Open tickets first, then ongoing, then solved
const statusRank: Record<TicketStatus, number> = { AWAITINGRESPONSE: 0, ONGOING: 1, SOLVED: 2 };
const headCellSx = { fontWeight: 600, color: "text.secondary", borderBottom: "2px solid #E8E0D5" };

export default function Tickets() {
  const { isAdmin } = useAuth();
  const admin = isAdmin();
  const [filter, setFilter] = useState<TicketStatus | "ALL">("ALL");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    // Admins see every ticket from every user; everyone else only their own
    (admin ? supportAPI.getAllTickets() : supportAPI.getTickets())
      .then((res) => {
        if (!active) return;
        if (res) setTickets(res.data);
        else setError("Could not load tickets. Please try again later.");
      })
      .catch(() => { if (active) setError("Could not load tickets. Please try again later."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [admin]);

  const visibleTickets = useMemo(() => {
    const filtered = filter === "ALL" ? tickets : tickets.filter((t) => t.status === filter);
    return [...filtered].sort((a, b) => statusRank[a.status] - statusRank[b.status] || b.id - a.id);
  }, [tickets, filter]);

  const countOf = (status: TicketStatus) => tickets.filter((t) => t.status === status).length;

  async function openTicket(id: number) {
    setError("");
    setNotice("");
    setDetailLoading(true);
    try {
      const res = await supportAPI.getTicket(id);
      if (!res) throw new Error("ticket not loaded");
      setSelected(res.data);
      setTickets((current) => current.map((t) => (t.id === res.data.id ? { ...t, status: res.data.status } : t)));
    } catch {
      setError("Could not open this ticket.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function create(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const res = await supportAPI.createTicket(title.trim(), content.trim());
      if (!res) throw new Error("ticket not created");
      const created = res.data;
      setTitle("");
      setContent("");
      setTickets((current) => [created, ...current]);
      setNotice("Ticket created successfully.");
      setSelected(created);
    } catch {
      setError("Could not create your ticket. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function sendReply(event: React.FormEvent) {
    event.preventDefault();
    if (!selected || !reply.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await supportAPI.respondToTicket(selected.id, reply.trim());
      if (!res) throw new Error("reply not sent");
      setReply("");
    } catch {
      setError("Could not send your message. Please try again.");
      setSaving(false);
      return;
    }
    await openTicket(selected.id);
    setNotice("Reply sent.");
    setSaving(false);
  }

  async function solve() {
    if (!selected) return;
    setSaving(true);
    setError("");
    const res = await supportAPI.solveTicket(selected.id);
    if (!res) {
      setError("Could not mark this ticket as solved.");
      setSaving(false);
      return;
    }
    await openTicket(selected.id);
    setNotice("Ticket marked as solved.");
    setSaving(false);
  }

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1100, mx: "auto" }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>{admin ? "Support desk" : "Support tickets"}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {admin ? "Review and respond to tickets from all users." : "Get help with a booking or follow up on an existing request."}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}

        {selected ? (
          <Card elevation={0}>
            <CardContent sx={{ p: 3 }}>
              <Button startIcon={<ArrowBack />} onClick={() => { setSelected(null); setReply(""); setError(""); }} sx={{ mb: 2 }}>All tickets</Button>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", mb: 1 }}>
                <Typography variant="h6">{selected.title}</Typography>
                <Chip size="small" label={statusLabels[selected.status] ?? selected.status} color={selected.status === "SOLVED" ? "success" : "secondary"} variant="outlined" />
              </Stack>
              <Typography variant="caption" color="text.secondary">Ticket #{selected.id}</Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2} sx={{ mb: 3 }}>
                {selected.messages?.length ? selected.messages.map((message) => (
                  <Box key={message.id} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                    <Stack direction="row" sx={{ justifyContent: "space-between", flexWrap: "wrap", mb: 0.5 }}>
                      <Typography variant="subtitle2">{message.sender}</Typography>
                      <Typography variant="caption" color="text.secondary">{new Date(message.timestamp).toLocaleString()}</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{message.content}</Typography>
                  </Box>
                )) : <Typography variant="body2" color="text.secondary">No messages yet.</Typography>}
              </Stack>
              {selected.status !== "SOLVED" ? (
                <Box component="form" onSubmit={sendReply} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <TextField label="Write a reply" value={reply} onChange={(e) => setReply(e.target.value)} multiline minRows={3} required fullWidth />
                  <Stack direction="row" spacing={1}>
                    <Button type="submit" variant="contained" endIcon={<Send />} disabled={saving || !reply.trim()}>Send reply</Button>
                    {admin && (
                      <Button variant="outlined" color="success" startIcon={<CheckCircle />} onClick={solve} disabled={saving}>Mark as solved</Button>
                    )}
                  </Stack>
                </Box>
              ) : (
                <Alert severity="info">This ticket has been solved.</Alert>
              )}
            </CardContent>
          </Card>
        ) : admin ? (
          <Card elevation={0}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 2 }}>
                <Typography variant="h6">All tickets</Typography>
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={filter}
                  onChange={(_, value: TicketStatus | "ALL" | null) => { if (value) setFilter(value); }}
                  aria-label="Filter tickets by status"
                >
                  <ToggleButton value="ALL">All ({tickets.length})</ToggleButton>
                  <ToggleButton value="AWAITINGRESPONSE">Awaiting ({countOf("AWAITINGRESPONSE")})</ToggleButton>
                  <ToggleButton value="ONGOING">Ongoing ({countOf("ONGOING")})</ToggleButton>
                  <ToggleButton value="SOLVED">Solved ({countOf("SOLVED")})</ToggleButton>
                </ToggleButtonGroup>
              </Stack>
              {loading && <CircularProgress size={24} aria-label="Loading tickets" />}
              {detailLoading && <CircularProgress size={24} aria-label="Opening ticket" />}
              {!loading && !error && !visibleTickets.length && (
                <Typography variant="body2" color="text.secondary">No tickets to show.</Typography>
              )}
              {visibleTickets.length > 0 && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={headCellSx}>#</TableCell>
                        <TableCell sx={headCellSx}>Subject</TableCell>
                        <TableCell sx={headCellSx}>From</TableCell>
                        <TableCell sx={headCellSx}>Opened</TableCell>
                        <TableCell sx={headCellSx}>Status</TableCell>
                        <TableCell sx={headCellSx} align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {visibleTickets.map((ticket) => {
                        const first = ticket.messages?.[0];
                        return (
                          <TableRow key={ticket.id} hover>
                            <TableCell>{ticket.id}</TableCell>
                            <TableCell sx={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600 }}>{ticket.title}</TableCell>
                            <TableCell>{first?.sender ?? "—"}</TableCell>
                            <TableCell>{first?.timestamp ? new Date(first.timestamp).toLocaleDateString() : "—"}</TableCell>
                            <TableCell>
                              <Chip size="small" label={statusLabels[ticket.status] ?? ticket.status} color={ticket.status === "SOLVED" ? "success" : "secondary"} variant="outlined" />
                            </TableCell>
                            <TableCell align="right">
                              <Button size="small" endIcon={<ArrowForward />} onClick={() => openTicket(ticket.id)} disabled={detailLoading}>Open</Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Card elevation={0} sx={{ height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>New ticket</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Tell us what you need help with.</Typography>
                  <Box component="form" onSubmit={create} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField label="Subject" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
                    <TextField label="Your message" value={content} onChange={(e) => setContent(e.target.value)} multiline minRows={5} required fullWidth />
                    <Button type="submit" variant="contained" startIcon={<Add />} disabled={saving || !title.trim() || !content.trim()} sx={{ alignSelf: "flex-start" }}>Create ticket</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Card elevation={0} sx={{ height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Your tickets</Typography>
                  {loading && <CircularProgress size={24} aria-label="Loading tickets" />}
                  {detailLoading && <CircularProgress size={24} aria-label="Opening ticket" />}
                  {!loading && !error && !tickets.length && <Typography variant="body2" color="text.secondary">No tickets yet. Create one to get started.</Typography>}
                  <Stack spacing={1}>
                    {tickets.map((ticket) => (
                      <Box key={ticket.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{ticket.title}</Typography>
                          <Typography variant="caption" color="text.secondary">#{ticket.id} · {statusLabels[ticket.status] ?? ticket.status}</Typography>
                        </Box>
                        <Button size="small" endIcon={<ArrowForward />} onClick={() => openTicket(ticket.id)} disabled={detailLoading}>View</Button>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Layout>
  );
}
