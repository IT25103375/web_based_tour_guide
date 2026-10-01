import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Divider, Grid, Stack, TextField, Typography } from "@mui/material";
import { Add, ArrowBack, ArrowForward, Send } from "@mui/icons-material";
import Layout from "../components/Layout";
import { supportAPI } from "../services/SupportService";
import type { Ticket } from "../models/Ticket";
import type { TicketStatus } from "../enums/TicketStatus";

const statusLabels: Record<TicketStatus, string> = {
  AWAITINGRESPONSE: "Awaiting response",
  ONGOING: "Ongoing",
  SOLVED: "Solved",
};

export default function Tickets() {
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
    supportAPI.getTickets()
      .then((res) => {
        if (!active) return;
        if (res) setTickets(res.data);
        else setError("Could not load tickets. Please try again later.");
      })
      .catch(() => { if (active) setError("Could not load tickets. Please try again later."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function openTicket(id: number) {
    setError("");
    setNotice("");
    setDetailLoading(true);
    try {
      const res = await supportAPI.getTicket(id);
      if (!res) throw new Error("ticket not loaded");
      setSelected(res.data);
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

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1100, mx: "auto" }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>Support tickets</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Get help with a booking or follow up on an existing request.</Typography>
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
              {selected.status !== "SOLVED" && (
                <Box component="form" onSubmit={sendReply} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <TextField label="Write a reply" value={reply} onChange={(e) => setReply(e.target.value)} multiline minRows={3} required fullWidth />
                  <Button type="submit" variant="contained" endIcon={<Send />} disabled={saving || !reply.trim()} sx={{ alignSelf: "flex-start" }}>Send reply</Button>
                </Box>
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
