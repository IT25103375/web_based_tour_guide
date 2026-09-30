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
import { eventAPI } from "../services/EventService";
import { discountAPI } from "../services/DiscountService";
import { userAdminAPI } from "../services/UserAdminService";
import { UserType } from "../enums/UserType.ts";
import {UserGet} from "@/models/User.ts";
import {Discount, DiscountList} from "@/models/Discount.ts";
import {Destination, DestinationList} from "@/models/Destination.ts";
import {TourPackage, TourPackageList} from "@/models/TourPackage.ts";
import {EventEntity, EventList} from "../models/EventEntity.ts";
import type {DiscountPriceType} from "@/enums/DiscountPriceType.ts";
import type {DiscountTimeType} from "@/enums/DiscountTimeType.ts";

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
    const [users, setUsers] = useState<UserGet[]>([]);
    const [packages, setPackages] = useState<TourPackageList>([]);
    const [events, setEvents] = useState<EventList>([]);
    const [discounts, setDiscounts] = useState<DiscountList>([]);
    const [destinations, setDestinations] = useState<DestinationList>([]);
    const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string; type: TabType } | null>(null);
    const [editDialog, setEditDialog] = useState<{ open: boolean; type: TabType; record: Record<string, unknown> | null }>({ open: false, type: "users", record: null });
    const [saved, setSaved] = useState(false);

    const [pkgForm, setPkgForm] = useState({ displayName: "", price: "", duration: "", description: "", capacity: "", destinationIds: [] as number[] });
    const [destForm, setDestForm] = useState({ displayName: "", location: "", description: "" });
    const [userForm, setUserForm] = useState({ username: "", email: "", password: "", userType: UserType.Tourist as string });
    const [eventForm, setEventForm] = useState({ eventName: "", location: "", description: "", price: "", capacity: "", startDate: "", endDate: "", applicablePackages: [] as number[] });
    const [discountForm, setDiscountForm] = useState<{
        couponCode: string;
        discountPriceType: DiscountPriceType;
        discountTimeType: DiscountTimeType;
        percentage: string;
        fixed: string;
        minAmount: string;
        startDate: string;
        endDate: string;
        applicablePackages: number[];
    }>({
        couponCode: "",
        discountPriceType: "PERCENTAGE",
        discountTimeType: "CODE",
        percentage: "",
        fixed: "",
        minAmount: "",
        startDate: "",
        endDate: "",
        applicablePackages: [] as number[]
    });

    const loadPackages = () => {
        tourPackageAPI.getPackages().then((res) => {
            if (Array.isArray(res?.data)) setPackages(res.data);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [destinations]);

    // Single source of truth per entity: how to populate its form from a
    // record, how to save it (add vs edit), how to delete it, and what to
    // reload afterward. openEdit / handleSave / handleDelete all just look
    // this up instead of branching on `type` themselves.
    const entityConfig: Record<TabType, {
        getId: (r: Record<string, unknown>) => number;
        mapToForm: (r: Record<string, unknown> | null) => void;
        save: (id: number | undefined) => Promise<unknown>;
        remove: (id: number) => Promise<unknown>;
        reload: () => void;
    }> = {
        packages: {
            getId: (r) => (r as { id: number }).id,
            mapToForm: (r) => {
                const p = r as Partial<TourPackage> | null;
                setPkgForm({
                    displayName: p?.displayName ?? "",
                    price: String(p?.price ?? ""),
                    duration: String(p?.duration ?? ""),
                    description: p?.description ?? "",
                    capacity: String(p?.capacity ?? ""),
                    destinationIds: p?.offeredDestinationIds ?? [],
                });
            },
            save: (id) => {
                const payload = {
                    displayName: pkgForm.displayName,
                    price: Number(pkgForm.price) || 0,
                    duration: Number(pkgForm.duration) || 0,
                    description: pkgForm.description,
                    capacity: Number(pkgForm.capacity) || 0,
                    offeredDestinationIds: pkgForm.destinationIds,
                };
                return id
                    ? tourPackageAPI.editPackage({ id, ...payload })
                    : tourPackageAPI.addPackage(payload);
            },
            remove: (id) => tourPackageAPI.deletePackage(id),
            reload: loadPackages,
        },
        destinations: {
            getId: (r) => (r as { id: number }).id,
            mapToForm: (r) => setDestForm({
                displayName: (r as { displayName?: string })?.displayName ?? "",
                location: (r as { location?: string })?.location ?? "",
                description: (r as { description?: string })?.description ?? "",
            }),
            save: (id) => {
                const dest: Destination = {
                    id: id,
                    displayName: destForm.displayName,
                    location: destForm.location,
                    description: destForm.description,
                    offeredPackageIds: [],
                };
                return id
                    ? destinationAPI.editDestination(dest)
                    : destinationAPI.addDestination(dest);
            },
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
            save: (id) => {
                const user = {
                    username: userForm.username,
                    email: userForm.email,
                    password: userForm.password,
                    userType: userForm.userType as any,
                };
                return id
                    ? userAdminAPI.updateUserRole(id, userForm.userType as any)
                    : userAdminAPI.addUser(user);
            },
            remove: (id) => userAdminAPI.deleteUser(id),
            reload: loadUsers,
        },
        events: {
            getId: (r) => (r as { eventId: number }).eventId,
            mapToForm: (r) => {
                const e = r as Partial<EventEntity> | null;
                setEventForm({
                    eventName: e?.eventName ?? "",
                    location: e?.location ?? "",
                    description: e?.description ?? "",
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
                    description: eventForm.description,
                    capacity: Number(eventForm.capacity) || 0,
                    price: Number(eventForm.price) || 0,
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
                const d = r as Partial<Discount> | null;
                setDiscountForm({
                    couponCode: d?.couponCode ?? "",
                    discountPriceType: d?.discountPriceType ?? "PERCENTAGE",
                    discountTimeType: d?.discountTimeType ?? "CODE",
                    percentage: String(d?.percentage ?? ""),
                    fixed: String(d?.fixed ?? ""),
                    minAmount: String(d?.minAmount ?? ""),
                    startDate: d?.startDate ? d.startDate.slice(0, 10) : "",
                    endDate: d?.endDate ? d.endDate.slice(0, 10) : "",
                    applicablePackages: d?.applicablePackagesIds ?? [],
                });
            },
            save: (id) => {
                const payload = {
                    couponCode: discountForm.couponCode || undefined,
                    percentage: discountForm.discountPriceType === "PERCENTAGE" ? Number(discountForm.percentage) || 0 : undefined,
                    fixed: discountForm.discountPriceType === "FIXED" ? Number(discountForm.fixed) || 0 : undefined,
                    minAmount: Number(discountForm.minAmount) || 0,
                    discountPriceType: discountForm.discountPriceType,
                    discountTimeType: discountForm.discountTimeType,
                    startDate: discountForm.startDate ? new Date(discountForm.startDate).toISOString() : new Date().toISOString(),
                    endDate: discountForm.endDate ? new Date(discountForm.endDate).toISOString() : new Date().toISOString(),
                };
                return id
                    ? discountAPI.editDiscount({ id, ...payload })
                    : discountAPI.addDiscount(payload);
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
        ids.map((id) => packages?.find((p) => p.id === id)?.displayName).filter(Boolean).join(", ") || "-";

    const getDestinationNames = (ids: number[] | null) =>
        (ids ?? []).map((id) => destinations?.find((d) => d.id === id)?.displayName).filter(Boolean).join(", ") || "—";

    // Column definitions per tab. Rendering logic (chips, truncation, joined
    // names, formatting) matches the real model fields; only the surrounding
    // table/head/hover/actions markup is shared via AdminTable.
    const usersColumns: ColumnDef<UserGet>[] = [
        { header: "Username", render: (u) => u.username },
        { header: "Email", render: (u) => u.email },
        { header: "Role", render: (u) => <Chip label={u.userType} size="small" color={u.userType === UserType.AgencyStaff || u.userType === UserType.TourManager ? "primary" : "default"} /> },
    ];

    const packagesColumns: ColumnDef<TourPackage>[] = [
        { header: "Name", cellSx: truncateSx(160), render: (p) => p.displayName },
        { header: "Destinations", cellSx: truncateSx(200), render: (p) => getDestinationNames(p.offeredDestinationIds) },
        { header: "Duration", render: (p) => `${p.duration}d` },
        { header: "Price (LKR)", render: (p) => p.price.toLocaleString() },
        { header: "Capacity", render: (p) => p.capacity },
    ];

    const eventsColumns: ColumnDef<EventEntity>[] = [
        { header: "Name", render: (e) => e.eventName },
        { header: "Packages", cellSx: truncateSx(160), render: (e) => getPackageNames(e.applicablePackages) },
        { header: "Start", render: (e) => e.startDate ? e.startDate.slice(0, 10) : "-" },
        { header: "Price (LKR)", render: (e) => e.price.toLocaleString() },
        { header: "Capacity", render: (e) => e.capacity },
    ];

    const discountsColumns: ColumnDef<Discount>[] = [
        { header: "Code", render: (d) => d.couponCode ? <code style={{ background: "#F0EBE1", padding: "2px 6px", borderRadius: 4 }}>{d.couponCode}</code> : "—" },
        { header: "Value", render: (d) => d.discountPriceType === "FIXED" ? `LKR ${(d.fixed ?? 0).toLocaleString()}` : `${d.percentage ?? 0}%` },
        { header: "Min Amount", render: (d) => `LKR ${d.minAmount?.toLocaleString()}` },
        { header: "Applies Via", render: (d) => <Chip label={d.discountTimeType} size="small" color={d.discountTimeType === "TIMED" ? "primary" : "default"} /> },
        { header: "Window", render: (d) => `${d.startDate?.slice(0, 10)} → ${d.endDate?.slice(0, 10)}` },
    ];

    const destinationsColumns: ColumnDef<Destination>[] = [
        { header: "Name", cellSx: { fontWeight: 600 }, render: (d) => d.displayName },
        { header: "Location", render: (d) => d.location },
        { header: "Description", cellSx: truncateSx(240), render: (d) => d.description },
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
                                    rows={packages ?? []}
                                    rowKey={(p) => p.id as number}
                                    onEdit={(p) => openEdit("packages", p as unknown as Record<string, unknown>)}
                                    onDelete={(p) => setDeleteTarget({ id: p.id as number, name: p.displayName, type: "packages" })}
                                />
                            )}
                            {tab === "events" && (
                                <AdminTable
                                    columns={eventsColumns}
                                    rows={events ?? []}
                                    rowKey={(e) => e.eventId as number}
                                    onEdit={(e) => openEdit("events", e as unknown as Record<string, unknown>)}
                                    onDelete={(e) => setDeleteTarget({ id: e.eventId as number, name: e.eventName, type: "events" })}
                                />
                            )}
                            {tab === "discounts" && (
                                <AdminTable
                                    columns={discountsColumns}
                                    rows={discounts ?? []}
                                    rowKey={(d) => d.id}
                                    onEdit={(d) => openEdit("discounts", d as unknown as Record<string, unknown>)}
                                    onDelete={(d) => setDeleteTarget({ id: d.id, name: d.couponCode || `Discount #${d.id}`, type: "discounts" })}
                                />
                            )}
                            {tab === "destinations" && (
                                <AdminTable
                                    columns={destinationsColumns}
                                    rows={destinations ?? []}
                                    rowKey={(d) => d.id as number}
                                    onEdit={(d) => openEdit("destinations", d as unknown as Record<string, unknown>)}
                                    onDelete={(d) => setDeleteTarget({ id: d.id as number, name: d.displayName, type: "destinations" })}
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
                                                .map((id) => destinations?.find((d) => d.id === id)?.displayName)
                                                .filter(Boolean)
                                                .join(", ")}
                                        >
                                            {destinations?.map((d) => (
                                                <MenuItem key={d.id} value={d.id}>{d.displayName}</MenuItem>
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
                                    <TextField
                                        label="Duration (days)"
                                        type="number"
                                        value={pkgForm.duration}
                                        onChange={(e) => setPkgForm({ ...pkgForm, duration: e.target.value })}
                                        size="small"
                                        fullWidth
                                    />
                                    <TextField
                                        label="Capacity"
                                        type="number"
                                        value={pkgForm.capacity}
                                        onChange={(e) => setPkgForm({ ...pkgForm, capacity: e.target.value })}
                                        size="small"
                                        fullWidth
                                    />
                                    <TextField
                                        label="Description"
                                        value={pkgForm.description}
                                        onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })}
                                        size="small"
                                        fullWidth
                                        multiline
                                        minRows={2}
                                    />
                                </>
                            )}
                            {editDialog.type === "events" && (
                                <>
                                    <TextField label="Event Name" value={eventForm.eventName} onChange={(e) => setEventForm({ ...eventForm, eventName: e.target.value })} size="small" fullWidth />
                                    <TextField label="Location" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} size="small" fullWidth />
                                    <TextField label="Description" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} size="small" fullWidth multiline minRows={2} />
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
                                                .map((id) => packages?.find((p) => p.id === id)?.displayName)
                                                .filter(Boolean)
                                                .join(", ")}
                                        >
                                            {packages?.map((p) => <MenuItem key={p.id} value={p.id}>{p.displayName}</MenuItem>)}
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
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Discount Type</InputLabel>
                                        <Select
                                            label="Discount Type"
                                            value={discountForm.discountPriceType}
                                            onChange={(e) => setDiscountForm({ ...discountForm, discountPriceType: e.target.value as DiscountPriceType })}
                                        >
                                            <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                                            <MenuItem value="FIXED">Fixed Amount</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {discountForm.discountPriceType === "FIXED" ? (
                                        <TextField label="Fixed Amount (LKR)" type="number" value={discountForm.fixed} onChange={(e) => setDiscountForm({ ...discountForm, fixed: e.target.value })} size="small" fullWidth />
                                    ) : (
                                        <TextField label="Discount %" type="number" value={discountForm.percentage} onChange={(e) => setDiscountForm({ ...discountForm, percentage: e.target.value })} size="small" fullWidth slotProps={{ htmlInput: { min: 1, max: 100 } }} />
                                    )}
                                    <TextField label="Minimum Amount (LKR)" type="number" value={discountForm.minAmount} onChange={(e) => setDiscountForm({ ...discountForm, minAmount: e.target.value })} size="small" fullWidth />
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Applies Via</InputLabel>
                                        <Select
                                            label="Applies Via"
                                            value={discountForm.discountTimeType}
                                            onChange={(e) => setDiscountForm({ ...discountForm, discountTimeType: e.target.value as DiscountTimeType })}
                                        >
                                            <MenuItem value="CODE">Coupon Code</MenuItem>
                                            <MenuItem value="TIMED">Timed Window</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {discountForm.discountTimeType == "CODE" && (
                                        <TextField
                                            label="Coupon Code"
                                            value={discountForm.couponCode}
                                            onChange={(e) => setDiscountForm({ ...discountForm, couponCode: e.target.value.toUpperCase() })}
                                            size="small"
                                            fullWidth
                                            slotProps={{ htmlInput: { style: { textTransform: "uppercase" } } }}
                                        />
                                    )}
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Tour Packages</InputLabel>
                                        <Select
                                            multiple
                                            label="Tour Packages"
                                            value={discountForm.applicablePackages}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setDiscountForm({ ...discountForm, applicablePackages: typeof value === "string" ? [] : (value as number[]) });
                                            }}
                                            input={<OutlinedInput label="Tour Packages" />}
                                            renderValue={(selected) => (selected as number[])
                                                .map((id) => packages?.find((p) => p.id === id)?.displayName)
                                                .filter(Boolean)
                                                .join(", ")}
                                        >
                                            {packages?.map((p) => <MenuItem key={p.id} value={p.id}>{p.displayName}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    <TextField label="Start Date" type="date" value={discountForm.startDate} onChange={(e) => setDiscountForm({ ...discountForm, startDate: e.target.value })} size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                                    <TextField label="End Date" type="date" value={discountForm.endDate} onChange={(e) => setDiscountForm({ ...discountForm, endDate: e.target.value })} size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
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
                                        multiline
                                        minRows={2}
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