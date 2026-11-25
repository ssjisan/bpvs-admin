"use client";
import {useState} from 'react';
import {Paper,Stack,Button,TextField,Alert,Table,TableHead,TableBody,TableRow,TableCell,TableContainer,Dialog,DialogTitle,DialogContent,DialogActions,Typography} from '@mui/material';
import {api,errorText} from '@/api';
import {useAuth} from '@/context/Auth';
import {useList} from '@/features/shared/useList';
import {Status,Empty,Pagination,RemarksDialog,ActionDialog,date,ref} from '@/features/shared/TableUI';
import type {QRReportRow} from './types';
import {endpoint} from './service';
export default function QRReportTable(){const list=useList<QRReportRow>(endpoint);const {user}=useAuth();const has=(p:string)=>!!user?.role.permissions.includes(p);const [search,S]=useState(''),[detail,setDetail]=useState<QRReportRow|null>(null);
const rows=list.rows.filter(r=>JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));return (
<Stack spacing={2}><Stack direction="row" spacing={2}><TextField size="small" label="Search current page" value={search} onChange={e=>S(e.target.value)}/><Button onClick={list.reload}>Refresh</Button></Stack>{list.error&&<Alert severity="error">{list.error}</Alert>}<Paper variant="outlined"><TableContainer><Table><TableHead><TableRow>
<TableCell>QR ID</TableCell>
<TableCell>Batch</TableCell>
<TableCell>Key ID</TableCell>
<TableCell>Expiry</TableCell>
<TableCell>Revoked</TableCell>
<TableCell>Generated</TableCell>
<TableCell>Actions</TableCell>
</TableRow></TableHead><TableBody>{list.busy||!rows.length?<Empty busy={list.busy} cols={7}/>:rows.map(r=><TableRow key={r._id}>
<TableCell>{r.qrId?.toLocaleString()??"—"}</TableCell>
<TableCell>{ref(r.batch)}</TableCell>
<TableCell>{r.keyId?.toLocaleString()??"—"}</TableCell>
<TableCell>{date(r.expiresAt)}</TableCell>
<TableCell>{r.revoked?"Yes":"No"}</TableCell>
<TableCell>{date(r.createdAt)}</TableCell>
<TableCell><Stack direction="row" spacing={1}><Button size="small" onClick={()=>setDetail(r)}>View</Button></Stack></TableCell>
</TableRow>)}</TableBody></Table></TableContainer><Pagination list={list}/></Paper>{detail&&<Dialog open onClose={()=>setDetail(null)} fullWidth><DialogTitle>QRReport details</DialogTitle><DialogContent><Stack spacing={2}><div><Typography variant="caption">QR ID</Typography><div>{detail.qrId?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Batch</Typography><div>{ref(detail.batch)}</div></div><div><Typography variant="caption">Key ID</Typography><div>{detail.keyId?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Expiry</Typography><div>{date(detail.expiresAt)}</div></div><div><Typography variant="caption">Revoked</Typography><div>{detail.revoked?"Yes":"No"}</div></div><div><Typography variant="caption">Generated</Typography><div>{date(detail.createdAt)}</div></div></Stack></DialogContent><DialogActions><Button onClick={()=>setDetail(null)}>Close</Button></DialogActions></Dialog>}</Stack>
);
}
