"use client";
import {useState} from 'react';
import {Paper,Stack,Button,TextField,MenuItem,Alert,Table,TableHead,TableBody,TableRow,TableCell,TableContainer,Dialog,DialogTitle,DialogContent,DialogActions,Typography} from '@mui/material';
import {api,errorText} from '@/api';
import {useAuth} from '@/context/Auth';
import {useList} from '@/features/shared/useList';
import {Status,Empty,Pagination,RemarksDialog,ActionDialog,date,ref} from '@/features/shared/TableUI';
import type {ViolationRow} from './types';
import {endpoint} from './service';
export default function ViolationTable(){const list=useList<ViolationRow>(endpoint);const {user}=useAuth();const has=(p:string)=>!!user?.role.permissions.includes(p);const [search,S]=useState(''),[detail,setDetail]=useState<ViolationRow|null>(null);const [action,setAction]=useState<ViolationRow|null>(null);
const [status,setStatus]=useState("");
const rows=list.rows.filter(r=>JSON.stringify(r).toLowerCase().includes(search.toLowerCase())&&(!status||r.status===status));return (
<Stack spacing={2}><Stack direction="row" spacing={2}><TextField size="small" label="Search current page" value={search} onChange={e=>S(e.target.value)}/><TextField select size="small" label="Status" value={status} onChange={e=>setStatus(e.target.value)}><MenuItem value="">All statuses</MenuItem><MenuItem value="REPORTED">REPORTED</MenuItem><MenuItem value="REVIEWED">REVIEWED</MenuItem></TextField><Button onClick={list.reload}>Refresh</Button></Stack>{list.error&&<Alert severity="error">{list.error}</Alert>}<Paper variant="outlined"><TableContainer><Table><TableHead><TableRow>
<TableCell>Violation type</TableCell>
<TableCell>Batch</TableCell>
<TableCell>Remarks</TableCell>
<TableCell>Status</TableCell>
<TableCell>Reported</TableCell>
<TableCell>Actions</TableCell>
</TableRow></TableHead><TableBody>{list.busy||!rows.length?<Empty busy={list.busy} cols={6}/>:rows.map(r=><TableRow key={r._id}>
<TableCell>{r.type?.toLocaleString()??"—"}</TableCell>
<TableCell>{ref(r.batch)}</TableCell>
<TableCell>{r.remarks?.toLocaleString()??"—"}</TableCell>
<TableCell><Status value={r.status}/></TableCell>
<TableCell>{date(r.createdAt)}</TableCell>
<TableCell><Stack direction="row" spacing={1}><Button size="small" onClick={()=>setDetail(r)}>View</Button>{has("violations.review")&&r.status==="REPORTED"&&<Button onClick={()=>setAction(r)}>Review</Button>}</Stack></TableCell>
</TableRow>)}</TableBody></Table></TableContainer><Pagination list={list}/></Paper>{detail&&<Dialog open onClose={()=>setDetail(null)} fullWidth><DialogTitle>Violation details</DialogTitle><DialogContent><Stack spacing={2}><div><Typography variant="caption">Violation type</Typography><div>{detail.type?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Batch</Typography><div>{ref(detail.batch)}</div></div><div><Typography variant="caption">Remarks</Typography><div>{detail.remarks?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Status</Typography><div><Status value={detail.status}/></div></div><div><Typography variant="caption">Reported</Typography><div>{date(detail.createdAt)}</div></div></Stack></DialogContent><DialogActions><Button onClick={()=>setDetail(null)}>Close</Button></DialogActions></Dialog>}{action&&<RemarksDialog title="Review violation" close={()=>setAction(null)} submit={async reviewRemarks=>{await api.patch(`/violations/${action._id}/review`,{reviewRemarks});await list.reload()}}/>}</Stack>
);
}
