"use client";

import { useState } from "react";
import {
    Box,
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

import {
    RefreshOutlined,
    VisibilityOutlined,
} from "@mui/icons-material";

import { useList } from "@/features/shared/useList";

import {
    Status,
    Empty,
    Pagination,
    date,
} from "@/features/shared/TableUI";

import type { ScanRow } from "./types";
import { endpoint } from "./service";

// Get inspector name
const getInspectorName = (
    officer: ScanRow["officer"]
): string => {
    if (!officer || typeof officer === "string") {
        return "—";
    }

    return officer.name || "—";
};

// Get batch number
const getBatchNumber = (
    batch: ScanRow["batch"]
): string => {
    if (!batch || typeof batch === "string") {
        return "—";
    }

    return batch.batchId || "—";
};

export default function ScanTable() {
    const list = useList<ScanRow>(endpoint);

    const [search, setSearch] = useState("");
    const [detail, setDetail] = useState<ScanRow | null>(null);

    const query = search.trim().toLowerCase();

    const rows = list.rows.filter((row) => {
        const fields = [
            getInspectorName(row.officer),
            getBatchNumber(row.batch),
            row.result,
            row.result?.replace(/_/g, " "),
            date(row.observedAt),
            date(row.createdAt),
        ];

        return fields.some((value) =>
            String(value ?? "")
                .toLowerCase()
                .includes(query)
        );
    });

    return (
        <Stack spacing={2}>

            {/* Table Toolbar */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
            >
                <TextField
                    size="small"
                    label="Search current page"
                    placeholder="Inspector, batch or result"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                        width: {
                            xs: "100%",
                            sm: 320,
                        },
                    }}
                />

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

            {/* Scan History Table */}
            <Paper variant="outlined">
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Inspector Name
                                </TableCell>

                                <TableCell>
                                    Batch No.
                                </TableCell>

                                <TableCell>
                                    Verification Result
                                </TableCell>

                                <TableCell>
                                    Observed
                                </TableCell>

                                <TableCell>
                                    Recorded
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
                                    cols={6}
                                />
                            ) : (
                                rows.map((row) => (
                                    <TableRow
                                        key={row._id}
                                        hover
                                    >
                                        {/* Inspector */}
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                            >
                                                {getInspectorName(
                                                    row.officer
                                                )}
                                            </Typography>
                                        </TableCell>

                                        {/* Batch Number */}
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                sx={{
                                                    overflowWrap:
                                                        "anywhere",
                                                }}
                                            >
                                                {getBatchNumber(
                                                    row.batch
                                                )}
                                            </Typography>
                                        </TableCell>

                                        {/* Verification Result */}
                                        <TableCell>
                                            <Status
                                                value={row.result}
                                            />
                                        </TableCell>

                                        {/* Observed Date */}
                                        <TableCell>
                                            {date(row.observedAt)}
                                        </TableCell>

                                        {/* Recorded Date */}
                                        <TableCell>
                                            {date(row.createdAt)}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell align="right">
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
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Pagination list={list} />
            </Paper>

            {/* Scan Details Dialog */}
            <Dialog
                open={Boolean(detail)}
                onClose={() => setDetail(null)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Scan Details
                </DialogTitle>

                <DialogContent dividers>
                    {detail && (
                        <Stack spacing={2.5}>

                            {/* Inspector */}
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Inspector Name
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                >
                                    {getInspectorName(
                                        detail.officer
                                    )}
                                </Typography>
                            </Box>

                            {/* Batch Number */}
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Batch No.
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={500}
                                    sx={{
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {getBatchNumber(
                                        detail.batch
                                    )}
                                </Typography>
                            </Box>

                            {/* Verification Result */}
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Verification Result
                                </Typography>

                                <Box sx={{ mt: 0.5 }}>
                                    <Status
                                        value={detail.result}
                                    />
                                </Box>
                            </Box>

                            {/* Observed Date */}
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Observed At
                                </Typography>

                                <Typography variant="body2">
                                    {date(detail.observedAt)}
                                </Typography>
                            </Box>

                            {/* Recorded Date */}
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Recorded At
                                </Typography>

                                <Typography variant="body2">
                                    {date(detail.createdAt)}
                                </Typography>
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
        </Stack>
    );
}