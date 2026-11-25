"use client";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
    ThemeProvider,
    CssBaseline,
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Alert,
    Stack,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Checkbox,
    FormControlLabel,
    CircularProgress,
    IconButton,
    Drawer,
    Divider,
} from "@mui/material";
import {
    DashboardOutlined,
    FactoryOutlined,
    Inventory2Outlined,
    QrCode2Outlined,
    AssessmentOutlined,
    PeopleOutline,
    SettingsOutlined,
    ShieldOutlined,
    HistoryOutlined,
    Logout,
    Menu,
    NotificationsOutlined,
    Refresh,
    Add,
    Download,
    Visibility,
    PersonOutline,
} from "@mui/icons-material";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { api, publicApi, saveTokens, clearTokens, errorText } from "@/api";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/Brand";
import { pretty, money, type Row, type User } from "@/types";
import { usePathname } from "next/navigation";
import { useAuth, workspace } from "@/context/Auth";
import { nav } from "@/config/navigation";
export const route = (id: string) =>
    ({
        qr: "qr-management",
        "production/logs": "production",
        scans: "surveillance",
        audit: "audit-logs",
        company: "company-profile",
    })[id] || id;
export const adminIds = [
    "dashboard",
    "manufacturers",
    "batches",
    "qr",
    "production/logs",
    "scans",
    "violations",
    "approvals",
    "reports",
    "users",
    "roles",
    "settings/qr",
    "audit",
    "profile",
];
export const manufacturerIds = [
    "dashboard",
    "batches",
    "qr",
    "production/logs",
    "company",
];
export function Workspace({
    kind,
    children,
}: {
    kind: "admin" | "manufacturer";
    children: ReactNode;
}) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [mobile, M] = useState(false),
        [notice, N] = useState<Row[] | null>(null),
        [error, E] = useState("");
    const allowed = kind === "admin" ? adminIds : manufacturerIds;
    const page =
        nav.find((n) => pathname === "/" + kind + "/" + route(n.id))?.id || "";
    useEffect(() => {
        if (!loading && (!user || workspace(user) !== kind))
            router.replace("/login");
    }, [loading, user, kind, router]);
    if (loading || !user || workspace(user) !== kind) return <CircularProgress />;
    const links = user
        ? nav
            .filter((n) => allowed.includes(n.id))
            .filter(
                (n) =>
                    !n.p.length || n.p.some((p) => user.role.permissions.includes(p)),
            )
            .filter((n) => n.id !== "company" || !!user.manufacturer)
        : [];
    const title = links.find((n) => n.id === page)?.label || "Dashboard";
    const sidebar = (
        <Box sx={{ p: 2, width: 260 }}>
            <Brand />
            <Typography
                variant="overline"
                className="muted"
                sx={{ display: "block", mt: 4, mb: 1, pl: 1 }}
            >
                Workspace
            </Typography>
            {links.map((n) => (
                <button
                    key={n.id}
                    className={"navlink " + (page === n.id ? "active" : "")}
                    onClick={() => {
                        router.push("/" + kind + "/" + route(n.id));
                        M(false);
                    }}
                >
                    <n.icon fontSize="small" />
                    {n.label}
                </button>
            ))}
        </Box>
    );
    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Box
                sx={{
                    width: 280,
                    flexShrink: 0,
                    display: { xs: "none", md: "block" },
                    bgcolor: "white",
                    borderRight: "1px solid #dfe3e8",
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    overflowY: "auto",
                }}
            >
                {sidebar}
            </Box>
            <Drawer open={mobile} onClose={() => M(false)}>
                {sidebar}
            </Drawer>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                    sx={{
                        height: 72,
                        bgcolor: "white",
                        borderBottom: "1px solid #dfe3e8",
                        display: "flex",
                        alignItems: "center",
                        px: { xs: 2, md: 4 },
                        gap: 2,
                    }}
                >
                    <IconButton
                        sx={{ display: { md: "none" } }}
                        onClick={() => M(true)}
                        aria-label="Open menu"
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="body2" className="muted" sx={{ flex: 1 }}>
                        {user.manufacturer ? "Manufacturer workspace" : "DoE workspace"}
                    </Typography>
                    <IconButton
                        aria-label="Notifications"
                        onClick={async () => {
                            try {
                                N((await api.get("/notifications")).data);
                            } catch (e) {
                                E(errorText(e));
                            }
                        }}
                    >
                        <NotificationsOutlined />
                    </IconButton>
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                        <Typography fontWeight={600} variant="body2">
                            {user.name}
                        </Typography>
                        <Typography variant="caption" className="muted">
                            {pretty(user.role.name)}
                        </Typography>
                    </Box>
                    <IconButton
                        aria-label="Sign out"
                        onClick={async () => {
                            try {
                                await logout();
                            } catch {
                            } finally {
                                router.replace("/login");
                            }
                        }}
                    >
                        <Logout />
                    </IconButton>
                </Box>
                <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1700, mx: "auto" }}>
                    <Typography variant="caption" className="muted">
                        Workspace / {title}
                    </Typography>
                    <Typography variant="h2" sx={{ mt: 1, mb: 1 }}>
                        {title}
                    </Typography>
                    <Typography className="muted" sx={{ mb: 3 }}>
                        {page === "dashboard"
                            ? `Welcome back, ${user.name}. Here is your BPVS overview.`
                            : "Manage and review BPVS records."}
                    </Typography>
                    {error && (
                        <Alert severity="error" onClose={() => E("")}>
                            {error}
                        </Alert>
                    )}
                    {links.some((n) => n.id === page) ? (
                        children
                    ) : (
                        <Alert severity="error">Access denied</Alert>
                    )}
                </Box>
            </Box>
            <Dialog open={notice !== null} onClose={() => N(null)} fullWidth>
                <DialogTitle>Notifications</DialogTitle>
                <DialogContent>
                    {notice?.length
                        ? notice.map((n) => (
                            <Box key={n._id} sx={{ py: 2, borderBottom: "1px solid #eee" }}>
                                <Typography fontWeight={600}>{n.title}</Typography>
                                <Typography>{n.message}</Typography>
                                {!n.read && (
                                    <Button
                                        size="small"
                                        onClick={async () => {
                                            try {
                                                await api.patch(`/notifications/${n._id}/read`);
                                                N(
                                                    (old) =>
                                                        old?.map((x) =>
                                                            x._id === n._id ? { ...x, read: true } : x,
                                                        ) || [],
                                                );
                                            } catch (e) {
                                                E(errorText(e));
                                            }
                                        }}
                                    >
                                        Mark as read
                                    </Button>
                                )}
                            </Box>
                        ))
                        : "No notifications"}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => N(null)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
