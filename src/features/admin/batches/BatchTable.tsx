"use client";

import { useState } from "react";

import {
    Box,
    Paper,
    Stack,
    Button,
    TextField,
    MenuItem,
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

import {
    RefreshOutlined,
    VisibilityOutlined,
} from "@mui/icons-material";

import { api } from "@/api";
import { useAuth } from "@/context/Auth";
import { useList } from "@/features/shared/useList";

import {
    Status,
    Empty,
    Pagination,
    RemarksDialog,
} from "@/features/shared/TableUI";

import type { BatchRow } from "./types";
import { endpoint } from "./service";

// ==========================================
// Manufacturer name
// ==========================================

const getManufacturerName = (
    manufacturer: BatchRow["manufacturer"]
): string => {
    if (!manufacturer || typeof manufacturer === "string") {
        return "—";
    }

    return manufacturer.name || "—";
};

// ==========================================
// Manufacturer ID
// ==========================================

const getManufacturerId = (
    manufacturer: BatchRow["manufacturer"]
): string => {
    if (!manufacturer || typeof manufacturer === "string") {
        return "—";
    }

    return manufacturer.companyId || "—";
};

export default function BatchTable() {
    const list = useList<BatchRow>(endpoint);

    const { user } = useAuth();

    const has = (permission: string) =>
        !!user?.role.permissions.includes(permission);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [detail, setDetail] =
        useState<BatchRow | null>(null);

    const [action, setAction] = useState<{
        row: BatchRow;
        decision: "APPROVED" | "REJECTED";
    } | null>(null);

    // ==========================================
    // Search and filtering
    // ==========================================

    const query = search.trim().toLowerCase();

    const rows = list.rows.filter((row) => {
        const searchableFields = [
            row.batchId,
            getManufacturerName(row.manufacturer),
            getManufacturerId(row.manufacturer),
            row.bagSize,
            row.quantity,
            row.reportedPrinted,
            row.distributionArea,
            row.status,
            row.productionStatus,
            row.productionStatus?.replace(/_/g, " "),
        ];

        const matchesSearch = searchableFields.some(
            (value) =>
                String(value ?? "")
                    .toLowerCase()
                    .includes(query)
        );

        const matchesStatus =
            !status || row.status === status;

        return matchesSearch && matchesStatus;
    });

    return (
        <Stack spacing={2}>

            {/* ==========================================
                Table Toolbar
            ========================================== */}

            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
            >
                <TextField
                    size="small"
                    label="Search current page"
                    placeholder="Manufacturer, batch or area"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    sx={{
                        width: {
                            xs: "100%",
                            sm: 320,
                        },
                    }}
                />

                <TextField
                    select
                    size="small"
                    label="Status"
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                    sx={{
                        minWidth: 180,
                    }}
                >
                    <MenuItem value="">
                        All statuses
                    </MenuItem>

                    <MenuItem value="PENDING">
                        Pending
                    </MenuItem>

                    <MenuItem value="APPROVED">
                        Approved
                    </MenuItem>

                    <MenuItem value="REJECTED">
                        Rejected
                    </MenuItem>
                </TextField>

                <Button
                    variant="outlined"
                    startIcon={<RefreshOutlined />}
                    onClick={list.reload}
                    disabled={list.busy}
                >
                    Refresh
                </Button>
            </Stack>

            {/* Error State */}

            {list.error && (
                <Alert severity="error">
                    {list.error}
                </Alert>
            )}

            {/* ==========================================
                Batch Management Table
            ========================================== */}

            <Paper variant="outlined">
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Manufacturer
                                </TableCell>

                                <TableCell>
                                    Bag Size
                                </TableCell>

                                <TableCell>
                                    Requested Quantity
                                </TableCell>

                                <TableCell>
                                    Reported Printed
                                </TableCell>

                                <TableCell>
                                    Distribution Area
                                </TableCell>

                                <TableCell>
                                    Status
                                </TableCell>

                                <TableCell>
                                    Production Status
                                </TableCell>

                                <TableCell align="right">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {list.busy || !rows.length ? (
                                <Empty
                                    busy={list.busy}
                                    cols={8}
                                />
                            ) : (
                                rows.map((row) => (
                                    <TableRow
                                        key={row._id}
                                        hover
                                    >

                                        {/* Manufacturer Name */}

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                            >
                                                {getManufacturerName(
                                                    row.manufacturer
                                                )}
                                            </Typography>
                                        </TableCell>

                                        {/* Bag Size */}

                                        <TableCell>
                                            {row.bagSize || "—"}
                                        </TableCell>

                                        {/* Requested Quantity */}

                                        <TableCell>
                                            {row.quantity?.toLocaleString() ??
                                                "—"}
                                        </TableCell>

                                        {/* Reported Printed */}

                                        <TableCell>
                                            {row.reportedPrinted?.toLocaleString() ??
                                                "—"}
                                        </TableCell>

                                        {/* Distribution Area */}

                                        <TableCell>
                                            {row.distributionArea ||
                                                "—"}
                                        </TableCell>

                                        {/* Batch Status */}

                                        <TableCell>
                                            <Status
                                                value={row.status}
                                            />
                                        </TableCell>

                                        {/* Production Status */}

                                        <TableCell>
                                            <Status
                                                value={
                                                    row.productionStatus
                                                }
                                            />
                                        </TableCell>

                                        {/* Actions */}

                                        <TableCell align="right">
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                sx={{
                                                    justifyContent:
                                                        "flex-end",
                                                }}
                                            >
                                                <Button
                                                    size="small"
                                                    variant="ghost"
                                                    startIcon={
                                                        <VisibilityOutlined />
                                                    }
                                                    onClick={() =>
                                                        setDetail(row)
                                                    }
                                                >
                                                    View
                                                </Button>

                                                {has("batches.review") &&
                                                    row.status ===
                                                        "PENDING" && (
                                                        <>
                                                            <Button
                                                                size="small"
                                                                color="success"
                                                                onClick={() =>
                                                                    setAction({
                                                                        row,
                                                                        decision:
                                                                            "APPROVED",
                                                                    })
                                                                }
                                                            >
                                                                Approve
                                                            </Button>

                                                            <Button
                                                                size="small"
                                                                color="error"
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    setAction({
                                                                        row,
                                                                        decision:
                                                                            "REJECTED",
                                                                    })
                                                                }
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
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

            {/* ==========================================
                Batch Details Modal
            ========================================== */}

            <Dialog
                open={Boolean(detail)}
                onClose={() => setDetail(null)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Batch Details
                </DialogTitle>

                <DialogContent dividers>
                    {detail && (
                        <Stack spacing={2.5}>

                            {/* Batch ID — Modal Only */}

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Batch ID
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    sx={{
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {detail.batchId || "—"}
                                </Typography>
                            </Box>

                            {/* Manufacturer Name */}

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Manufacturer Name
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                >
                                    {getManufacturerName(
                                        detail.manufacturer
                                    )}
                                </Typography>
                            </Box>

                            {/* Manufacturer ID */}

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Manufacturer ID
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {getManufacturerId(
                                        detail.manufacturer
                                    )}
                                </Typography>
                            </Box>

                            {/* Bag Size */}

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Bag Size
                                </Typography>

                                <Typography variant="body2">
                                    {detail.bagSize || "—"}
                                </Typography>
                            </Box>

                            {/* Quantity */}

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Approved / Requested Quantity
                                </Typography>

                                <Typography variant="body2">
                                    {detail.quantity?.toLocaleString() ??
                                        "—"}
                                </Typography>
                            </Box>

                            {/* Reported Printed */}

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Reported Printed
                                </Typography>

                                <Typography variant="body2">
                                    {detail.reportedPrinted?.toLocaleString() ??
                                        "—"}
                                </Typography>
                            </Box>

                            {/* Distribution Area */}

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Distribution Area
                                </Typography>

                                <Typography variant="body2">
                                    {detail.distributionArea ||
                                        "—"}
                                </Typography>
                            </Box>

                            {/* Batch Status */}

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Batch Status
                                </Typography>

                                <Box sx={{ mt: 0.5 }}>
                                    <Status
                                        value={detail.status}
                                    />
                                </Box>
                            </Box>

                            {/* Production Status */}

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Production Status
                                </Typography>

                                <Box sx={{ mt: 0.5 }}>
                                    <Status
                                        value={
                                            detail.productionStatus
                                        }
                                    />
                                </Box>
                            </Box>

                        </Stack>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={() => setDetail(null)}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ==========================================
                Approve / Reject Dialog
            ========================================== */}

            {action && (
                <RemarksDialog
                    title={
                        action.decision === "APPROVED"
                            ? "Approve Batch"
                            : "Reject Batch"
                    }
                    close={() => setAction(null)}
                    submit={async (remarks) => {
                        await api.post(
                            `${endpoint}/${action.row._id}/review`,
                            {
                                decision: action.decision,
                                remarks,
                            }
                        );

                        setAction(null);

                        await list.reload();
                    }}
                />
            )}

        </Stack>
    );
}