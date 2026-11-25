"use client";
import { useState } from "react";
import {
    Paper,
    Stack,
    Button,
    TextField,
    Alert,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from "@mui/material";
import { api, errorText } from "@/api";
import { useAuth } from "@/context/Auth";
import { useList } from "@/features/shared/useList";
import {
    Status,
    Empty,
    Pagination,
    RemarksDialog,
    ActionDialog,
    date,
    ref,
} from "@/features/shared/TableUI";
import type { ApprovalRow } from "./types";
import { endpoint } from "./service";
export default function ApprovalTable() {
    const list = useList<ApprovalRow>(endpoint);
    const { user } = useAuth();
    const has = (p: string) => !!user?.role.permissions.includes(p);
    const [search, S] = useState(""),
        [detail, setDetail] = useState<ApprovalRow | null>(null);
    const rows = list.rows.filter((r) =>
        JSON.stringify(r).toLowerCase().includes(search.toLowerCase()),
    );
    return (
        <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
                <TextField
                    size="small"
                    label="Search current page"
                    value={search}
                    onChange={(e) => S(e.target.value)}
                />
                <Button onClick={list.reload}>Refresh</Button>
            </Stack>
            {list.error && <Alert severity="error">{list.error}</Alert>}
            <Paper variant="outlined">
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Entity type</TableCell>
                                <TableCell>Record</TableCell>
                                <TableCell>Decision</TableCell>
                                <TableCell>Remarks</TableCell>
                                <TableCell>Reviewed</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list.busy || !rows.length ? (
                                <Empty busy={list.busy} cols={6} />
                            ) : (
                                rows.map((r) => (
                                    <TableRow key={r._id}>
                                        <TableCell>
                                            {r.entityType?.toLocaleString() ?? "—"}
                                        </TableCell>
                                        <TableCell>
                                            <Stack spacing={0.5}>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={600}
                                                    sx={{ overflowWrap: "anywhere" }}
                                                >
                                                    {r.recordName || "—"}
                                                </Typography>

                                                {r.entityType === "batch" &&
                                                    r.record?.manufacturer?.name && (
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            {r.record.manufacturer.name}
                                                        </Typography>
                                                    )}

                                                {r.entityType === "manufacturer" &&
                                                    r.record?.companyId && (
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            sx={{ overflowWrap: "anywhere" }}
                                                        >
                                                            {r.record.companyId}
                                                        </Typography>
                                                    )}
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Status value={r.decision} />
                                        </TableCell>
                                        <TableCell>{r.remarks?.toLocaleString() ?? "—"}</TableCell>
                                        <TableCell>{date(r.createdAt)}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <Button size="small" onClick={() => setDetail(r)}>
                                                    View
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination list={list} />
            </Paper>
            {detail && (
                <Dialog open onClose={() => setDetail(null)} fullWidth>
                    <DialogTitle>Approval details</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2}>
                            <div>
                                <Typography variant="caption">Entity type</Typography>
                                <div>{detail.entityType?.toLocaleString() ?? "—"}</div>
                            </div>
                            <div>
                                <Typography variant="caption">Record</Typography>
                                <div>{ref(detail.entity)}</div>
                            </div>
                            <div>
                                <Typography variant="caption">Decision</Typography>
                                <div>
                                    <Status value={detail.decision} />
                                </div>
                            </div>
                            <div>
                                <Typography variant="caption">Remarks</Typography>
                                <div>{detail.remarks?.toLocaleString() ?? "—"}</div>
                            </div>
                            <div>
                                <Typography variant="caption">Reviewed</Typography>
                                <div>{date(detail.createdAt)}</div>
                            </div>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDetail(null)}>Close</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Stack>
    );
}
