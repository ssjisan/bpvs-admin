"use client";
import {useState} from 'react';
import {Paper,Stack,Button,TextField,Alert,Table,TableHead,TableBody,TableRow,TableCell,TableContainer,Dialog,DialogTitle,DialogContent,DialogActions,Typography} from '@mui/material';
import {api,errorText} from '@/api';
import {useAuth} from '@/context/Auth';
import {useList} from '@/features/shared/useList';
import {Status,Empty,Pagination,RemarksDialog,ActionDialog,date,ref} from '@/features/shared/TableUI';
import type {ScanReportRow} from './types';
import {endpoint} from './service';
export default function ScanReportTable(){const list=useList<ScanReportRow>(endpoint);const {user}=useAuth();const has=(p:string)=>!!user?.role.permissions.includes(p);const [search,S]=useState(''),[detail,setDetail]=useState<ScanReportRow|null>(null);
const rows=list.rows.filter(r=>JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));return (
<Stack spacing={2}><Stack direction="row" spacing={2}><TextField size="small" label="Search current page" value={search} onChange={e=>S(e.target.value)}/><Button onClick={list.reload}>Refresh</Button></Stack>{list.error&&<Alert severity="error">{list.error}</Alert>}<Paper variant="outlined"><TableContainer><Table><TableHead><TableRow>
<TableCell>Inspector</TableCell>
<TableCell>Batch</TableCell>
<TableCell>Verification result</TableCell>
<TableCell>Observed</TableCell>
<TableCell>Recorded</TableCell>
<TableCell>Actions</TableCell>
</TableRow></TableHead><TableBody>{list.busy||!rows.length?<Empty busy={list.busy} cols={6}/>:rows.map(r=><TableRow key={r._id}>
<TableCell>{ref(r.officer)}</TableCell>
<TableCell>{ref(r.batch)}</TableCell>
<TableCell><Status value={r.result}/></TableCell>
<TableCell>{date(r.observedAt)}</TableCell>
<TableCell>{date(r.createdAt)}</TableCell>
<TableCell><Stack direction="row" spacing={1}><Button size="small" onClick={()=>setDetail(r)}>View</Button></Stack></TableCell>
</TableRow>)}</TableBody></Table></TableContainer><Pagination list={list}/></Paper>{detail&&<Dialog open onClose={()=>setDetail(null)} fullWidth><DialogTitle>ScanReport details</DialogTitle><DialogContent><Stack spacing={2}><div><Typography variant="caption">Inspector</Typography><div>{ref(detail.officer)}</div></div><div><Typography variant="caption">Batch</Typography><div>{ref(detail.batch)}</div></div><div><Typography variant="caption">Verification result</Typography><div><Status value={detail.result}/></div></div><div><Typography variant="caption">Observed</Typography><div>{date(detail.observedAt)}</div></div><div><Typography variant="caption">Recorded</Typography><div>{date(detail.createdAt)}</div></div></Stack></DialogContent><DialogActions><Button onClick={()=>setDetail(null)}>Close</Button></DialogActions></Dialog>}</Stack>
);
}
