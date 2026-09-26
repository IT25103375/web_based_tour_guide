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
import { useEffect, useState, type ReactNode } from "react";
import Layout from "../components/Layout";
import { tourPackageAPI } from "../services/TourPackageService";
import { destinationAPI } from "../services/DestinationService";
import { eventAPI} from "../services/EventService";
import { discountAPI} from "../services/DiscountService";
import { userAdminAPI} from "../services/UserAdminService";
import { UserType } from "../enums/UserType.ts";
import {UserPost} from "@/models/User.ts";
import {Discount, DiscountList} from "@/models/Discount.ts";
import {Destination, DestinationList} from "@/models/Destination.ts";
import {TourPackageList} from "@/models/TourPackage.ts";

type TabType = "users" | "packages" | "events" | "discounts" | "destinations";

const roleOptions = Object.values(UserType);

const tableCellSx = { fontWeight: 600, color: "text.secondary", borderBottom: "2px solid #E8E0D5" };

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

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
    return (
        <>
            <Tooltip title="Edit"><IconButton size="small" onClick={onEdit}><Edit fontSize="small" /></IconButton></Tooltip>
            <Tooltip title="Delete"><IconButton size="small" color="error" onClick={onDelete}><Delete fontSize="small" /></IconButton></Tooltip>
        </>
    );
}

interface ColumnDef<T> {
    header: string;
    cellSx?: object;
    render: (row: T) => ReactNode;
}

function AdminTable<T>({ columns, rows, rowKey, onEdit, onDelete }: {
    columns: ColumnDef<T>[];
    rows: T[];
    rowKey: (row: T) => number;
    onEdit: (row: T) => void;
    onDelete: (row: T) => void;
}) {
    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    {columns.map((col) => <TableCell key={col.header} sx={tableCellSx}>{col.header}</TableCell>)}
                    <TableCell sx={tableCellSx} align="right">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={rowKey(row)} sx={{ "&:hover": { bgcolor: "#FAFAF8" } }}>
                        {columns.map((col) => <TableCell key={col.header} sx={col.cellSx}>{col.render(row)}</TableCell>)}
                        <TableCell align="right">
                            <RowActions onEdit={() => onEdit(row)} onDelete={() => onDelete(row)} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

const truncateSx = (maxWidth: number) => ({ maxWidth, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const });

export default function AdminPanel() {
    const [tab, setTab] = useState<TabType>("users");
    const [users, setUsers] = useState<UserPost[]>([]);
    const [packages, setPackages] = useState<TourPackageList>([]);
    const [events, setEvents] = useState<EvenetList>([]);
    const [discounts, setDiscounts] = useState<DiscountList>([]);
    const [destinations, setDestinations] = useState<DestinationList>([]);
    const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string; type: TabType } | null>(null);
    const [editDialog, setEditDialog] = useState<{ open: boolean; type: TabType; record: Record<string, unknown> | null }>({ open: false, type: "users", record: null });
    const [saved, setSaved] = useState(false);

    const [pkgForm, setPkgForm] = useState({ displayName: "", price: "", destinationIds: [] as number[] });
    const [destForm, setDestForm] = useState({ displayName: "", location: "", description: "" });
    const [userForm, setUserForm] = useState({ username: "", email: "", password: "", userType: UserType.Tourist as string });
    const [eventForm, setEventForm] = useState({ eventName: "", location: "", price: "", capacity: "", startDate: "", endDate: "", applicablePackages: [] as number[] });
    const [discountForm, setDiscountForm] = useState({ code: "", percentage: "", minAmount: "", active: true });

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
                            destination: ids.map((id) => destinations.find((d) => d.id === id)?.displayName ?? "—").join(", ") || "—",
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
            if (Array.isArray(res?.data)) setDestinations(res.data);
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
    }, [destinations]);

    const entityConfig: Record<TabType, {
        getId: (r: Record<string, unknown>) => number;
        mapToForm: (r: Record<string, unknown> | null) => void;
        save: (id: number | undefined) => Promise<unknown>;
        remove: (id: number) => Promise<unknown>;
        reload: () => void;
    }> = {
        packages: {
            getId: (r) => (r as { id: number }).id,
            mapToForm: (r) => setPkgForm({
                displayName: (r as { name?: string })?.name ?? "",
                price: String((r as { price?: number })?.price ?? ""),
                destinationIds: (r as { destinationIds?: number[] })?.destinationIds ?? [],
            }),
            save: (id) => {
                const price = Number(pkgForm.price) || 0;
                return id
                    ? tourPackageAPI.editPackage(id, pkgForm.displayName, price, pkgForm.destinationIds)
                    : tourPackageAPI.addPackage(pkgForm.displayName, price, pkgForm.destinationIds);
            },
            remove: (id) => tourPackageAPI.deletePackage(id),
            reload: loadPackages,
        },
        destinations: {
            getId: (r) => (r as { id: number }).id,
            mapToForm: (r) => setDestForm({
                displayName: (r as { name?: string })?.name ?? "",
                location: (r as { location?: string })?.location ?? "",
                description: (r as { description?: string})?.description ?? "",
            }),
            save: (id) => id
                ? destinationAPI.editDestination(id, destForm.displayName, destForm.location)
                : destinationAPI.addDestination(destForm.displayName, destForm.location),
            remove: (id) => destinationAPI.removeDestination(id),
            reload: () => { loadDestinations(); loadPackages(); },
        },
        users: {
            getId: (r) => (r as { id: number }).id,
            mapToForm: (r) => setUserForm({
                username: (r as { username?: string })?.username ?? "",
                email: (r as { email?: string })?.email ?? "",
                password: "",
                userType: (r as { userType?: string })?.userType ?? UserType.Tourist,
            }),
            save: (id) => id
                ? userAdminAPI.updateUserRole(id, userForm.userType as any)
                : userAdminAPI.addUser(userForm.username, userForm.email, userForm.password, userForm.userType as any),
            remove: (id) => userAdminAPI.deleteUser(id),
            reload: loadUsers,
        },
        events: {
            getId: (r) => (r as { eventId: number }).eventId,
            mapToForm: (r) => {
                const e = r as Partial<EventAdmin> | null;
                setEventForm({
                    eventName: e?.eventName ?? "",
                    location: e?.location ?? "",
                    price: String(e?.price ?? ""),
                    capacity: String(e?.capacity ?? ""),
                    startDate: e?.startDate ? e.startDate.slice(0, 10) : "",
                    endDate: e?.endDate ? e.endDate.slice(0, 10) : "",
                    applicablePackages: e?.applicablePackages ?? [],
                });
            },
            save: (id) => {
                const payload = {
                    eventName: eventForm.eventName,
                    location: eventForm.location,
                    price: Number(eventForm.price) || 0,
                    capacity: Number(eventForm.capacity) || 0,
                    startDate: eventForm.startDate ? new Date(eventForm.startDate).toISOString() : new Date().toISOString(),
                    endDate: eventForm.endDate ? new Date(eventForm.endDate).toISOString() : new Date().toISOString(),
                    applicablePackages: eventForm.applicablePackages,
                };
                return id ? eventAPI.editEvent({ eventId: id, ...payload }) : eventAPI.addEvent(payload);
            },
            remove: (id) => eventAPI.deleteEvent(id),
            reload: loadEvents,
        },
        discounts: {
            getId: (r) => (r as { id: number }).id,
            mapToForm: (r) => {
                const d = r as Partial<DiscountAdmin> | null;
                setDiscountForm({
                    code: d?.code ?? "",
                    percentage: String(d?.percentage ?? ""),
                    minAmount: String(d?.minAmount ?? ""),
                    active: d?.active ?? true,
                });
            },
            save: (id) => {
                const percentage = Number(discountForm.percentage) || 0;
                const minAmount = Number(discountForm.minAmount) || 0;
                return id
                    ? discountAPI.editDiscount(id, discountForm.code, percentage, minAmount, discountForm.active)
                    : discountAPI.addDiscount(discountForm.code, percentage, minAmount, discountForm.active);
            },
            remove: (id) => discountAPI.deleteDiscount(id),
            reload: loadDiscounts,
        },
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        const { id, type } = deleteTarget;
        entityConfig[type].remove(id).then(entityConfig[type].reload);
        setDeleteTarget(null);
    };

    const openEdit = (type: TabType, record: Record<string, unknown> | null) => {
        entityConfig[type].mapToForm(record);
        setEditDialog({ open: true, type, record });
        setSaved(false);
    };

    const finishSave = (reload: () => void) => {
        reload();
        setSaved(true);
        setTimeout(() => { setEditDialog({ open: false, type: tab, record: null }); setSaved(false); }, 800);
    };

    const handleSave = () => {
        const { type, record } = editDialog;
        const config = entityConfig[type];
        const id = record ? config.getId(record) : undefined;
        config.save(id).then(() => finishSave(config.reload));
    };

    const getPackageNames = (ids: number[]) =>
        ids.map((id) => packages.find((p) => p.id === id)?.name).filter(Boolean).join(", ") || "-";

    // Column definitions per tab. Rendering logic (chips, truncation, joined
    // names, formatting) matches the original cells exactly; only the
    // surrounding table/head/hover/actions markup is now shared.
    const usersColumns: ColumnDef<UserPost>[] = [
        { header: "Username", render: (u) => u.username },
        { header: "Email", render: (u) => u.email },
        { header: "Role", render: (u) => <Chip label={u.userType} size="small" color={u.userType === UserType.AgencyStaff || u.userType === UserType.TourManager ? "primary" : "default"} /> },
    ];

    const packagesColumns: ColumnDef<AdminPackage>[] = [
        { header: "Name", cellSx: truncateSx(180), render: (p) => p.name },
        { header: "Destinations", cellSx: truncateSx(220), render: (p) => p.destination },
        { header: "Price (LKR)", render: (p) => p.price.toLocaleString() },
    ];

    const eventsColumns: ColumnDef<EventAdmin>[] = [
        { header: "Name", render: (e) => e.eventName },
        { header: "Packages", cellSx: truncateSx(160), render: (e) => getPackageNames(e.applicablePackages) },
        { header: "Start", render: (e) => e.startDate ? e.startDate.slice(0, 10) : "-" },
        { header: "Price (LKR)", render: (e) => e.price.toLocaleString() },
        { header: "Capacity", render: (e) => e.capacity },
    ];

    const discountsColumns: ColumnDef<DiscountAdmin>[] = [
        { header: "Code", render: (d) => <code style={{ background: "#F0EBE1", padding: "2px 6px", borderRadius: 4 }}>{d.code}</code> },
        { header: "Discount", render: (d) => `${d.percentage}%` },
        { header: "Min Amount", render: (d) => `LKR ${d.minAmount?.toLocaleString()}` },
        { header: "Status", render: (d) => <Chip label={d.active ? "Active" : "Inactive"} size="small" color={d.active ? "success" : "default"} /> },
    ];

    const destinationsColumns: ColumnDef<AdminDestination>[] = [
        { header: "Name", cellSx: { fontWeight: 600 }, render: (d) => d.name },
        { header: "Location", render: (d) => d.location },
        { header: "Description", render: (d) => d.description },
    ];

    return (
        <Layout>
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 1 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>Admin Panel</Typography>
                        <Typography variant="body2" color="text.secondary">Manage system data</Typography>
                    </Box>
                    <Button variant="contained" startIcon={<Add />} onClick={() => openEdit(tab, null)}>
                        Add {tab.slice(0, -1).charAt(0).toUpperCase() + tab.slice(0, -1).slice(1)}
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
                            {tab === "users" && (
                                <AdminTable
                                    columns={usersColumns}
                                    rows={users}
                                    rowKey={(u) => u.id}
                                    onEdit={(u) => openEdit("users", u as unknown as Record<string, unknown>)}
                                    onDelete={(u) => setDeleteTarget({ id: u.id, name: u.username, type: "users" })}
                                />
                            )}
                            {tab === "packages" && (
                                <AdminTable
                                    columns={packagesColumns}
                                    rows={packages}
                                    rowKey={(p) => p.id}
                                    onEdit={(p) => openEdit("packages", p as unknown as Record<string, unknown>)}
                                    onDelete={(p) => setDeleteTarget({ id: p.id, name: p.name, type: "packages" })}
                                />
                            )}
                            {tab === "events" && (
                                <AdminTable
                                    columns={eventsColumns}
                                    rows={events}
                                    rowKey={(e) => e.eventId}
                                    onEdit={(e) => openEdit("events", e as unknown as Record<string, unknown>)}
                                    onDelete={(e) => setDeleteTarget({ id: e.eventId, name: e.eventName, type: "events" })}
                                />
                            )}
                            {tab === "discounts" && (
                                <AdminTable
                                    columns={discountsColumns}
                                    rows={discounts}
                                    rowKey={(d) => d.id}
                                    onEdit={(d) => openEdit("discounts", d as unknown as Record<string, unknown>)}
                                    onDelete={(d) => setDeleteTarget({ id: d.id, name: d.code, type: "discounts" })}
                                />
                            )}
                            {tab === "destinations" && (
                                <AdminTable
                                    columns={destinationsColumns}
                                    rows={destinations}
                                    rowKey={(d) => d.id}
                                    onEdit={(d) => openEdit("destinations", d as unknown as Record<string, unknown>)}
                                    onDelete={(d) => setDeleteTarget({ id: d.id, name: d.name, type: "destinations" })}
                                />
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
                                        label="Location"
                                        value={destForm.location}
                                        onChange={(e) => setDestForm({ ...destForm, location: e.target.value })}
                                        size="small"
                                        fullWidth
                                    />
                                    <TextField
                                        label="Description"
                                        value={destForm.description}
                                        onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
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