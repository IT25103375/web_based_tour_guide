import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Alert,
} from "@mui/material";
import { Edit, Delete, Add, Close } from "@mui/icons-material";
import { useState } from "react";
import Layout from "../components/Layout";
import {
  users as initialUsers,
  tourPackages as initialPackages,
  events as initialEvents,
  discounts as initialDiscounts,
  destinations as initialDestinations,
} from "../data/mockData";

type TabType = "users" | "packages" | "events" | "discounts" | "destinations";

function ConfirmDeleteDialog({ open, name, onConfirm, onClose }: { open: boolean; name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Alert severity="warning">
          Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="error">Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminPanel() {
  const [tab, setTab] = useState<TabType>("users");
  const [users, setUsers] = useState(initialUsers);
  const [packages, setPackages] = useState(initialPackages);
  const [events, setEvents] = useState(initialEvents);
  const [discounts, setDiscounts] = useState(initialDiscounts);
  const [destinations, setDestinations] = useState(initialDestinations);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string; type: TabType } | null>(null);
  const [editDialog, setEditDialog] = useState<{ open: boolean; type: TabType; record: Record<string, unknown> | null }>({ open: false, type: "users", record: null });
  const [saved, setSaved] = useState(false);

  const handleDelete = () => {
    if (!deleteTarget) return;
    const { id, type } = deleteTarget;
    if (type === "users") setUsers((u) => u.filter((x) => x.id !== id));
    if (type === "packages") setPackages((u) => u.filter((x) => x.id !== id));
    if (type === "events") setEvents((u) => u.filter((x) => x.id !== id));
    if (type === "discounts") setDiscounts((u) => u.filter((x) => x.id !== id));
    if (type === "destinations") setDestinations((u) => u.filter((x) => x.id !== id));
    setDeleteTarget(null);
  };

  const openEdit = (type: TabType, record: Record<string, unknown> | null) => {
    setEditDialog({ open: true, type, record });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setEditDialog({ open: false, type: tab, record: null }); setSaved(false); }, 800);
  };

  const tableCellSx = { fontWeight: 600, color: "text.secondary", borderBottom: "2px solid #E8E0D5" };

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 1 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Admin Panel</Typography>
            <Typography variant="body2" color="text.secondary">Manage system data</Typography>
          </Box>
          <Button variant="contained" startIcon={<Add />} onClick={() => openEdit(tab, null)}>
            Add {tab === "packages" ? "Package" : tab.slice(0, -1).charAt(0).toUpperCase() + tab.slice(0, -1).slice(1)}
          </Button>
        </Box>

        <Card elevation={0} sx={{ border: "1px solid #E8E0D5" }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ borderBottom: "1px solid #E8E0D5", px: 1 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Users" value="users" />
            <Tab label="Tour Packages" value="packages" />
            <Tab label="Events" value="events" />
            <Tab label="Discounts" value="discounts" />
            <Tab label="Destinations" value="destinations" />
          </Tabs>

          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              {/* USERS */}
              {tab === "users" && (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={tableCellSx}>Name</TableCell>
                      <TableCell sx={tableCellSx}>Email</TableCell>
                      <TableCell sx={tableCellSx}>Role</TableCell>
                      <TableCell sx={tableCellSx}>Joined</TableCell>
                      <TableCell sx={tableCellSx} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id} sx={{ "&:hover": { bgcolor: "#FAFAF8" } }}>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell><Chip label={u.role} size="small" color={u.role === "admin" ? "primary" : "default"} /></TableCell>
                        <TableCell>{u.joined}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit("users", u as unknown as Record<string, unknown>)}><Edit fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteTarget({ id: u.id, name: u.name, type: "users" })}><Delete fontSize="small" /></IconButton></Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* PACKAGES */}
              {tab === "packages" && (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={tableCellSx}>Name</TableCell>
                      <TableCell sx={tableCellSx}>Destination</TableCell>
                      <TableCell sx={tableCellSx}>Price (LKR)</TableCell>
                      <TableCell sx={tableCellSx}>Duration</TableCell>
                      <TableCell sx={tableCellSx}>Status</TableCell>
                      <TableCell sx={tableCellSx} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {packages.map((p) => (
                      <TableRow key={p.id} sx={{ "&:hover": { bgcolor: "#FAFAF8" } }}>
                        <TableCell sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</TableCell>
                        <TableCell>{p.destination}</TableCell>
                        <TableCell>{p.price.toLocaleString()}</TableCell>
                        <TableCell>{p.duration}</TableCell>
                        <TableCell><Chip label={p.available ? "Available" : "Full"} size="small" color={p.available ? "success" : "default"} /></TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit("packages", p as unknown as Record<string, unknown>)}><Edit fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteTarget({ id: p.id, name: p.name, type: "packages" })}><Delete fontSize="small" /></IconButton></Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* EVENTS */}
              {tab === "events" && (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={tableCellSx}>Name</TableCell>
                      <TableCell sx={tableCellSx}>Package</TableCell>
                      <TableCell sx={tableCellSx}>Date</TableCell>
                      <TableCell sx={tableCellSx}>Price (LKR)</TableCell>
                      <TableCell sx={tableCellSx}>Capacity</TableCell>
                      <TableCell sx={tableCellSx} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.map((e) => {
                      const pkg = packages.find((p) => p.id === e.packageId);
                      return (
                        <TableRow key={e.id} sx={{ "&:hover": { bgcolor: "#FAFAF8" } }}>
                          <TableCell>{e.name}</TableCell>
                          <TableCell sx={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pkg?.name ?? "-"}</TableCell>
                          <TableCell>{e.date}</TableCell>
                          <TableCell>{e.price.toLocaleString()}</TableCell>
                          <TableCell>{e.capacity}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit("events", e as unknown as Record<string, unknown>)}><Edit fontSize="small" /></IconButton></Tooltip>
                            <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteTarget({ id: e.id, name: e.name, type: "events" })}><Delete fontSize="small" /></IconButton></Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}

              {/* DISCOUNTS */}
              {tab === "discounts" && (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={tableCellSx}>Code</TableCell>
                      <TableCell sx={tableCellSx}>Description</TableCell>
                      <TableCell sx={tableCellSx}>Discount</TableCell>
                      <TableCell sx={tableCellSx}>Min Amount</TableCell>
                      <TableCell sx={tableCellSx}>Status</TableCell>
                      <TableCell sx={tableCellSx} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {discounts.map((d) => (
                      <TableRow key={d.id} sx={{ "&:hover": { bgcolor: "#FAFAF8" } }}>
                        <TableCell><code style={{ background: "#F0EBE1", padding: "2px 6px", borderRadius: 4 }}>{d.code}</code></TableCell>
                        <TableCell>{d.description}</TableCell>
                        <TableCell>{d.percentage}%</TableCell>
                        <TableCell>LKR {d.minAmount.toLocaleString()}</TableCell>
                        <TableCell><Chip label={d.active ? "Active" : "Inactive"} size="small" color={d.active ? "success" : "default"} /></TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit("discounts", d as unknown as Record<string, unknown>)}><Edit fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteTarget({ id: d.id, name: d.code, type: "discounts" })}><Delete fontSize="small" /></IconButton></Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* DESTINATIONS */}
              {tab === "destinations" && (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={tableCellSx}>Name</TableCell>
                      <TableCell sx={tableCellSx}>Province</TableCell>
                      <TableCell sx={tableCellSx}>Climate</TableCell>
                      <TableCell sx={tableCellSx}>Best Time</TableCell>
                      <TableCell sx={tableCellSx} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {destinations.map((d) => (
                      <TableRow key={d.id} sx={{ "&:hover": { bgcolor: "#FAFAF8" } }}>
                        <TableCell sx={{ fontWeight: 600 }}>{d.name}</TableCell>
                        <TableCell>{d.province}</TableCell>
                        <TableCell>{d.climate}</TableCell>
                        <TableCell>{d.bestTime}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit("destinations", d as unknown as Record<string, unknown>)}><Edit fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteTarget({ id: d.id, name: d.name, type: "destinations" })}><Delete fontSize="small" /></IconButton></Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Generic edit dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ ...editDialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {editDialog.record ? "Edit Record" : "Add New Record"}
          <IconButton size="small" onClick={() => setEditDialog({ ...editDialog, open: false })}><Close fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {saved ? (
            <Alert severity="success">Saved successfully!</Alert>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0.5 }}>
              {editDialog.type === "users" && (
                <>
                  <TextField label="Full Name" defaultValue={(editDialog.record as { name?: string })?.name ?? ""} size="small" fullWidth />
                  <TextField label="Email" type="email" defaultValue={(editDialog.record as { email?: string })?.email ?? ""} size="small" fullWidth />
                  <FormControl size="small" fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select label="Role" defaultValue={(editDialog.record as { role?: string })?.role ?? "user"}>
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
              {editDialog.type === "packages" && (
                <>
                  <TextField label="Package Name" defaultValue={(editDialog.record as { name?: string })?.name ?? ""} size="small" fullWidth />
                  <TextField label="Destination" defaultValue={(editDialog.record as { destination?: string })?.destination ?? ""} size="small" fullWidth />
                  <TextField label="Price (LKR)" type="number" defaultValue={(editDialog.record as { price?: number })?.price ?? ""} size="small" fullWidth />
                  <TextField label="Duration" defaultValue={(editDialog.record as { duration?: string })?.duration ?? ""} size="small" fullWidth />
                  <TextField label="Description" defaultValue={(editDialog.record as { description?: string })?.description ?? ""} size="small" fullWidth multiline rows={2} />
                  <FormControl size="small" fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select label="Status" defaultValue={(editDialog.record as { available?: boolean })?.available ?? true}>
                      <MenuItem value={true as unknown as string}>Available</MenuItem>
                      <MenuItem value={false as unknown as string}>Full / Unavailable</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
              {editDialog.type === "events" && (
                <>
                  <TextField label="Event Name" defaultValue={(editDialog.record as { name?: string })?.name ?? ""} size="small" fullWidth />
                  <FormControl size="small" fullWidth>
                    <InputLabel>Tour Package</InputLabel>
                    <Select label="Tour Package" defaultValue={(editDialog.record as { packageId?: number })?.packageId ?? ""}>
                      {packages.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <TextField label="Date" type="date" defaultValue={(editDialog.record as { date?: string })?.date ?? ""} size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <TextField label="Price (LKR)" type="number" defaultValue={(editDialog.record as { price?: number })?.price ?? ""} size="small" fullWidth />
                  <TextField label="Capacity" type="number" defaultValue={(editDialog.record as { capacity?: number })?.capacity ?? ""} size="small" fullWidth />
                  <TextField label="Description" defaultValue={(editDialog.record as { description?: string })?.description ?? ""} size="small" fullWidth multiline rows={2} />
                </>
              )}
              {editDialog.type === "discounts" && (
                <>
                  <TextField label="Coupon Code" defaultValue={(editDialog.record as { code?: string })?.code ?? ""} size="small" fullWidth slotProps={{ htmlInput: { style: { textTransform: "uppercase" } } }} />
                  <TextField label="Description" defaultValue={(editDialog.record as { description?: string })?.description ?? ""} size="small" fullWidth />
                  <TextField label="Discount %" type="number" defaultValue={(editDialog.record as { percentage?: number })?.percentage ?? ""} size="small" fullWidth slotProps={{ htmlInput: { min: 1, max: 100 } }} />
                  <TextField label="Minimum Amount (LKR)" type="number" defaultValue={(editDialog.record as { minAmount?: number })?.minAmount ?? ""} size="small" fullWidth />
                  <FormControl size="small" fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select label="Status" defaultValue={(editDialog.record as { active?: boolean })?.active ?? true}>
                      <MenuItem value={true as unknown as string}>Active</MenuItem>
                      <MenuItem value={false as unknown as string}>Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
              {editDialog.type === "destinations" && (
                <>
                  <TextField label="Destination Name" defaultValue={(editDialog.record as { name?: string })?.name ?? ""} size="small" fullWidth />
                  <TextField label="Province" defaultValue={(editDialog.record as { province?: string })?.province ?? ""} size="small" fullWidth />
                  <TextField label="Climate" defaultValue={(editDialog.record as { climate?: string })?.climate ?? ""} size="small" fullWidth />
                  <TextField label="Best Time to Visit" defaultValue={(editDialog.record as { bestTime?: string })?.bestTime ?? ""} size="small" fullWidth />
                  <TextField label="Description" defaultValue={(editDialog.record as { description?: string })?.description ?? ""} size="small" fullWidth multiline rows={3} />
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditDialog({ ...editDialog, open: false })} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        name={deleteTarget?.name ?? ""}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </Layout>
  );
}
