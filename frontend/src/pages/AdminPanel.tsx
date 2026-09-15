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
  OutlinedInput,
} from "@mui/material";
import { Edit, Delete, Add, Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { tourPackageAPI } from "../services/TourPackageService";
import { destinationAPI } from "../services/DestinationService";
import { eventAPI, type EventAdmin } from "../services/EventService";
import { discountAPI, type DiscountAdmin } from "../services/DiscountService";
import { userAdminAPI, type UserAdmin } from "../services/UserAdminService";
import { UserType } from "../enums/UserType.ts";

type TabType = "users" | "packages" | "events" | "discounts" | "destinations";

interface AdminPackage {
  id: number;
  name: string;
  destination: string;
  destinationIds: number[];
  price: number;
}

interface AdminDestination {
  id: number;
  name: string;
  province: string;
}

const roleOptions = Object.values(UserType);

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
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [events, setEvents] = useState<EventAdmin[]>([]);
  const [discounts, setDiscounts] = useState<DiscountAdmin[]>([]);
  const [destinations, setDestinations] = useState<AdminDestination[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string; type: TabType } | null>(null);
  const [editDialog, setEditDialog] = useState<{ open: boolean; type: TabType; record: Record<string, unknown> | null }>({ open: false, type: "users", record: null });
  const [saved, setSaved] = useState(false);

  const [pkgForm, setPkgForm] = useState({ displayName: "", price: "", destinationIds: [] as number[] });
  const [destForm, setDestForm] = useState({ displayName: "", location: "" });
  const [userForm, setUserForm] = useState({ username: "", email: "", password: "", userType: UserType.Tourist as string });
  const [eventForm, setEventForm] = useState({ eventName: "", location: "", price: "", capacity: "", startDate: "", endDate: "", applicablePackages: [] as number[] });
  const [discountForm, setDiscountForm] = useState({ code: "", description: "", percentage: "", minAmount: "", active: true });

  const loadPackages = () => {
    tourPackageAPI.getPackages().then((res) => {
      const data = res?.data;
      if (Array.isArray(data)) {
        setPackages(
            data.map((pkg: any) => {
              const ids: number[] = pkg.offeredDestinationIds ?? [];
              return {
                id: pkg.id,
                name: pkg.displayName,
                destination: ids.map((id) => destinations.find((d) => d.id === id)?.name ?? "—").join(", ") || "—",
                destinationIds: ids,
                price: pkg.price,
              };
            })
        );
      }
    });
  };

  const loadDestinations = () => {
    destinationAPI.getDestinations().then((res) => {
      const data = res?.data;
      if (Array.isArray(data)) {
        setDestinations(
            data.map((dest: any) => ({
              id: dest.id,
              name: dest.displayName,
              province: dest.location,
            }))
        );
      }
    });
  };

  const loadUsers = () => {
    userAdminAPI.getUsers().then((res) => {
      if (Array.isArray(res?.data)) setUsers(res.data);
    });
  };

  const loadEvents = () => {
    eventAPI.getAllEventsAdmin().then((res) => {
      if (Array.isArray(res?.data)) setEvents(res.data);
    });
  };

  const loadDiscounts = () => {
    discountAPI.getDiscounts().then((res) => {
      if (Array.isArray(res?.data)) setDiscounts(res.data);
    });
  };

  useEffect(() => {
    loadDestinations();
    loadUsers();
    loadEvents();
    loadDiscounts();
  }, []);

  // Package destination names depend on the destinations list, so reload
  // packages once destinations have arrived (and whenever they change).
  useEffect(() => {
    loadPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinations]);

  const handleDelete = () => {
    if (!deleteTarget) return;
    const { id, type } = deleteTarget;
    if (type === "users") userAdminAPI.deleteUser(id).then(loadUsers);
    if (type === "packages") tourPackageAPI.deletePackage(id).then(loadPackages);
    if (type === "events") eventAPI.deleteEvent(id).then(loadEvents);
    if (type === "discounts") discountAPI.deleteDiscount(id).then(loadDiscounts);
    if (type === "destinations") destinationAPI.removeDestination(id).then(() => { loadDestinations(); loadPackages(); });
    setDeleteTarget(null);
  };

  const openEdit = (type: TabType, record: Record<string, unknown> | null) => {
    if (type === "packages") {
      setPkgForm({
        displayName: (record as { name?: string })?.name ?? "",
        price: String((record as { price?: number })?.price ?? ""),
        destinationIds: (record as { destinationIds?: number[] })?.destinationIds ?? [],
      });
    }
    if (type === "destinations") {
      setDestForm({
        displayName: (record as { name?: string })?.name ?? "",
        location: (record as { province?: string })?.province ?? "",
      });
    }
    if (type === "users") {
      setUserForm({
        username: (record as { username?: string })?.username ?? "",
        email: (record as { email?: string })?.email ?? "",
        password: "",
        userType: (record as { userType?: string })?.userType ?? UserType.Tourist,
      });
    }
    if (type === "events") {
      const e = record as Partial<EventAdmin> | null;
      setEventForm({
        eventName: e?.eventName ?? "",
        location: e?.location ?? "",
        price: String(e?.price ?? ""),
        capacity: String(e?.capacity ?? ""),
        startDate: e?.startDate ? e.startDate.slice(0, 10) : "",
        endDate: e?.endDate ? e.endDate.slice(0, 10) : "",
        applicablePackages: e?.applicablePackages ?? [],
      });
    }
    if (type === "discounts") {
      const d = record as Partial<DiscountAdmin> | null;
      setDiscountForm({
        code: d?.code ?? "",
        description: d?.description ?? "",
        percentage: String(d?.percentage ?? ""),
        minAmount: String(d?.minAmount ?? ""),
        active: d?.active ?? true,
      });
    }
    setEditDialog({ open: true, type, record });
    setSaved(false);
  };

  const finishSave = (reload: () => void) => {
    reload();
    setSaved(true);
    setTimeout(() => { setEditDialog({ open: false, type: tab, record: null }); setSaved(false); }, 800);
  };

  const handleSave = () => {
    const type = editDialog.type;
    const id = type === "events"
        ? (editDialog.record as { eventId?: number })?.eventId
        : (editDialog.record as { id?: number })?.id;

    if (type === "packages") {
      const price = Number(pkgForm.price) || 0;
      const req = id
          ? tourPackageAPI.editPackage(id, pkgForm.displayName, price, pkgForm.destinationIds)
          : tourPackageAPI.addPackage(pkgForm.displayName, price, pkgForm.destinationIds);
      req.then(() => finishSave(loadPackages));
      return;
    }

    if (type === "destinations") {
      const req = id
          ? destinationAPI.editDestination(id, destForm.displayName, destForm.location)
          : destinationAPI.addDestination(destForm.displayName, destForm.location);
      req.then(() => finishSave(() => { loadDestinations(); loadPackages(); }));
      return;
    }

    if (type === "users") {
      if (id) {
        userAdminAPI.updateUserRole(id, userForm.userType as any).then(() => finishSave(loadUsers));
      } else {
        userAdminAPI.addUser(userForm.username, userForm.email, userForm.password, userForm.userType as any).then(() => finishSave(loadUsers));
      }
      return;
    }

    if (type === "events") {
      const payload = {
        eventName: eventForm.eventName,
        location: eventForm.location,
        price: Number(eventForm.price) || 0,
        capacity: Number(eventForm.capacity) || 0,
        startDate: eventForm.startDate ? new Date(eventForm.startDate).toISOString() : new Date().toISOString(),
        endDate: eventForm.endDate ? new Date(eventForm.endDate).toISOString() : new Date().toISOString(),
        applicablePackages: eventForm.applicablePackages,
      };
      const req = id
          ? eventAPI.editEvent({ eventId: id, ...payload })
          : eventAPI.addEvent(payload);
      req.then(() => finishSave(loadEvents));
      return;
    }

    if (type === "discounts") {
      const percentage = Number(discountForm.percentage) || 0;
      const minAmount = Number(discountForm.minAmount) || 0;
      const req = id
          ? discountAPI.editDiscount(id, discountForm.code, discountForm.description, percentage, minAmount, discountForm.active)
          : discountAPI.addDiscount(discountForm.code, discountForm.description, percentage, minAmount, discountForm.active);
      req.then(() => finishSave(loadDiscounts));
      return;
    }
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
                          <TableCell sx={tableCellSx}>Username</TableCell>
                          <TableCell sx={tableCellSx}>Email</TableCell>
                          <TableCell sx={tableCellSx}>Role</TableCell>
                          <TableCell sx={tableCellSx} align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((u) => (
                            <TableRow key={u.id} sx={{ "&:hover": { bgcolor: "#FAFAF8" } }}>
                              <TableCell>{u.username}</TableCell>
                              <TableCell>{u.email}</TableCell>
                              <TableCell><Chip label={u.userType} size="small" color={u.userType === UserType.AgencyStaff || u.userType === UserType.TourManager ? "primary" : "default"} /></TableCell>
                              <TableCell align="right">
                                <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit("users", u as unknown as Record<string, unknown>)}><Edit fontSize="small" /></IconButton></Tooltip>
                                <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteTarget({ id: u.id, name: u.username, type: "users" })}><Delete fontSize="small" /></IconButton></Tooltip>
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
                          <TableCell sx={tableCellSx}>Destinations</TableCell>
                          <TableCell sx={tableCellSx}>Price (LKR)</TableCell>
                          <TableCell sx={tableCellSx} align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {packages.map((p) => (
                            <TableRow key={p.id} sx={{ "&:hover": { bgcolor: "#FAFAF8" } }}>
                              <TableCell sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</TableCell>
                              <TableCell sx={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.destination}</TableCell>
                              <TableCell>{p.price.toLocaleString()}</TableCell>
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
                          <TableCell sx={tableCellSx}>Packages</TableCell>
                          <TableCell sx={tableCellSx}>Start</TableCell>
                          <TableCell sx={tableCellSx}>Price (LKR)</TableCell>
                          <TableCell sx={tableCellSx}>Capacity</TableCell>
                          <TableCell sx={tableCellSx} align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {events.map((e) => {
                          const pkgNames = e.applicablePackages
                              .map((id) => packages.find((p) => p.id === id)?.name)
                              .filter(Boolean)
                              .join(", ") || "-";
                          return (
                              <TableRow key={e.eventId} sx={{ "&:hover": { bgcolor: "#FAFAF8" } }}>
                                <TableCell>{e.eventName}</TableCell>
                                <TableCell sx={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pkgNames}</TableCell>
                                <TableCell>{e.startDate ? e.startDate.slice(0, 10) : "-"}</TableCell>
                                <TableCell>{e.price.toLocaleString()}</TableCell>
                                <TableCell>{e.capacity}</TableCell>
                                <TableCell align="right">
                                  <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit("events", e as unknown as Record<string, unknown>)}><Edit fontSize="small" /></IconButton></Tooltip>
                                  <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteTarget({ id: e.eventId, name: e.eventName, type: "events" })}><Delete fontSize="small" /></IconButton></Tooltip>
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
                              <TableCell>LKR {d.minAmount?.toLocaleString()}</TableCell>
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
                          <TableCell sx={tableCellSx} align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {destinations.map((d) => (
                            <TableRow key={d.id} sx={{ "&:hover": { bgcolor: "#FAFAF8" } }}>
                              <TableCell sx={{ fontWeight: 600 }}>{d.name}</TableCell>
                              <TableCell>{d.province}</TableCell>
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
                        <TextField
                            label="Username"
                            value={userForm.username}
                            onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                            size="small"
                            fullWidth
                            disabled={!!editDialog.record}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={userForm.email}
                            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                            size="small"
                            fullWidth
                            disabled={!!editDialog.record}
                        />
                        {!editDialog.record && (
                            <TextField
                                label="Password"
                                type="password"
                                value={userForm.password}
                                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                size="small"
                                fullWidth
                            />
                        )}
                        <FormControl size="small" fullWidth>
                          <InputLabel>Role</InputLabel>
                          <Select
                              label="Role"
                              value={userForm.userType}
                              onChange={(e) => setUserForm({ ...userForm, userType: e.target.value })}
                          >
                            {roleOptions.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </>
                  )}
                  {editDialog.type === "packages" && (
                      <>
                        <TextField
                            label="Package Name"
                            value={pkgForm.displayName}
                            onChange={(e) => setPkgForm({ ...pkgForm, displayName: e.target.value })}
                            size="small"
                            fullWidth
                        />
                        <FormControl size="small" fullWidth>
                          <InputLabel>Destinations</InputLabel>
                          <Select
                              multiple
                              label="Destinations"
                              value={pkgForm.destinationIds}
                              onChange={(e) => {
                                const value = e.target.value;
                                setPkgForm({ ...pkgForm, destinationIds: typeof value === "string" ? [] : (value as number[]) });
                              }}
                              input={<OutlinedInput label="Destinations" />}
                              renderValue={(selected) => (selected as number[])
                                  .map((id) => destinations.find((d) => d.id === id)?.name)
                                  .filter(Boolean)
                                  .join(", ")}
                          >
                            {destinations.map((d) => (
                                <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <TextField
                            label="Price (LKR)"
                            type="number"
                            value={pkgForm.price}
                            onChange={(e) => setPkgForm({ ...pkgForm, price: e.target.value })}
                            size="small"
                            fullWidth
                        />
                      </>
                  )}
                  {editDialog.type === "events" && (
                      <>
                        <TextField label="Event Name" value={eventForm.eventName} onChange={(e) => setEventForm({ ...eventForm, eventName: e.target.value })} size="small" fullWidth />
                        <TextField label="Location" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} size="small" fullWidth />
                        <FormControl size="small" fullWidth>
                          <InputLabel>Tour Packages</InputLabel>
                          <Select
                              multiple
                              label="Tour Packages"
                              value={eventForm.applicablePackages}
                              onChange={(e) => {
                                const value = e.target.value;
                                setEventForm({ ...eventForm, applicablePackages: typeof value === "string" ? [] : (value as number[]) });
                              }}
                              input={<OutlinedInput label="Tour Packages" />}
                              renderValue={(selected) => (selected as number[])
                                  .map((id) => packages.find((p) => p.id === id)?.name)
                                  .filter(Boolean)
                                  .join(", ")}
                          >
                            {packages.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                          </Select>
                        </FormControl>
                        <TextField label="Start Date" type="date" value={eventForm.startDate} onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })} size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                        <TextField label="End Date" type="date" value={eventForm.endDate} onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })} size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                        <TextField label="Price (LKR)" type="number" value={eventForm.price} onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })} size="small" fullWidth />
                        <TextField label="Capacity" type="number" value={eventForm.capacity} onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })} size="small" fullWidth />
                      </>
                  )}
                  {editDialog.type === "discounts" && (
                      <>
                        <TextField
                            label="Coupon Code"
                            value={discountForm.code}
                            onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value.toUpperCase() })}
                            size="small"
                            fullWidth
                            slotProps={{ htmlInput: { style: { textTransform: "uppercase" } } }}
                        />
                        <TextField label="Description" value={discountForm.description} onChange={(e) => setDiscountForm({ ...discountForm, description: e.target.value })} size="small" fullWidth />
                        <TextField
                            label="Discount %"
                            type="number"
                            value={discountForm.percentage}
                            onChange={(e) => setDiscountForm({ ...discountForm, percentage: e.target.value })}
                            size="small"
                            fullWidth
                            slotProps={{ htmlInput: { min: 1, max: 100 } }}
                        />
                        <TextField label="Minimum Amount (LKR)" type="number" value={discountForm.minAmount} onChange={(e) => setDiscountForm({ ...discountForm, minAmount: e.target.value })} size="small" fullWidth />
                        <FormControl size="small" fullWidth>
                          <InputLabel>Status</InputLabel>
                          <Select
                              label="Status"
                              value={discountForm.active ? "active" : "inactive"}
                              onChange={(e) => setDiscountForm({ ...discountForm, active: e.target.value === "active" })}
                          >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                          </Select>
                        </FormControl>
                      </>
                  )}
                  {editDialog.type === "destinations" && (
                      <>
                        <TextField
                            label="Destination Name"
                            value={destForm.displayName}
                            onChange={(e) => setDestForm({ ...destForm, displayName: e.target.value })}
                            size="small"
                            fullWidth
                        />
                        <TextField
                            label="Province / Location"
                            value={destForm.location}
                            onChange={(e) => setDestForm({ ...destForm, location: e.target.value })}
                            size="small"
                            fullWidth
                        />
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