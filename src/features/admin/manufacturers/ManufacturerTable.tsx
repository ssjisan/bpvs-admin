"use client";
import {useState} from 'react';
import {Paper,Stack,Button,TextField,MenuItem,Alert,Table,TableHead,TableBody,TableRow,TableCell,TableContainer,Dialog,DialogTitle,DialogContent,DialogActions,Typography} from '@mui/material';
import {api,errorText} from '@/api';
import {useAuth} from '@/context/Auth';
import {useList} from '@/features/shared/useList';
import {Status,Empty,Pagination,RemarksDialog,ActionDialog,date,ref} from '@/features/shared/TableUI';
import type {ManufacturerRow} from './types';
import {endpoint} from './service';
export default function ManufacturerTable(){const list=useList<ManufacturerRow>(endpoint);const {user}=useAuth();const has=(p:string)=>!!user?.role.permissions.includes(p);const [search,S]=useState(''),[detail,setDetail]=useState<ManufacturerRow|null>(null);const [action,setAction]=useState<{row:ManufacturerRow;decision:string}|null>(null);
const [status,setStatus]=useState("");
const rows=list.rows.filter(r=>JSON.stringify(r).toLowerCase().includes(search.toLowerCase())&&(!status||r.status===status));return (
<Stack spacing={2}><Stack direction="row" spacing={2}><TextField size="small" label="Search current page" value={search} onChange={e=>S(e.target.value)}/><TextField select size="small" label="Status" value={status} onChange={e=>setStatus(e.target.value)}><MenuItem value="">All statuses</MenuItem><MenuItem value="PENDING">PENDING</MenuItem><MenuItem value="APPROVED">APPROVED</MenuItem><MenuItem value="REJECTED">REJECTED</MenuItem><MenuItem value="SUSPENDED">SUSPENDED</MenuItem></TextField><Button onClick={list.reload}>Refresh</Button></Stack>{list.error&&<Alert severity="error">{list.error}</Alert>}<Paper variant="outlined"><TableContainer><Table><TableHead><TableRow>
<TableCell>Manufacturer ID</TableCell>
<TableCell>Company</TableCell>
<TableCell>License</TableCell>
<TableCell>Address</TableCell>
<TableCell>Status</TableCell>
<TableCell>Registered</TableCell>
<TableCell>Actions</TableCell>
</TableRow></TableHead><TableBody>{list.busy||!rows.length?<Empty busy={list.busy} cols={7}/>:rows.map(r=><TableRow key={r._id}>
<TableCell>{r.companyId?.toLocaleString()??"—"}</TableCell>
<TableCell>{r.name?.toLocaleString()??"—"}</TableCell>
<TableCell>{r.license?.toLocaleString()??"—"}</TableCell>
<TableCell>{r.address?.toLocaleString()??"—"}</TableCell>
<TableCell><Status value={r.status}/></TableCell>
<TableCell>{date(r.createdAt)}</TableCell>
<TableCell><Stack direction="row" spacing={1}><Button size="small" onClick={()=>setDetail(r)}>View</Button>{has("manufacturers.review")&&["PENDING","SUSPENDED"].includes(r.status||"")&&<><Button size="small" onClick={()=>setAction({row:r,decision:"APPROVED"})}>Approve</Button><Button size="small" color="error" onClick={()=>setAction({row:r,decision:"REJECTED"})}>Reject</Button></>} {has("manufacturers.review")&&r.status==="APPROVED"&&<Button size="small" onClick={()=>setAction({row:r,decision:"SUSPENDED"})}>Suspend</Button>}</Stack></TableCell>
</TableRow>)}</TableBody></Table></TableContainer><Pagination list={list}/></Paper>{detail&&<Dialog open onClose={()=>setDetail(null)} fullWidth><DialogTitle>Manufacturer details</DialogTitle><DialogContent><Stack spacing={2}><div><Typography variant="caption">Manufacturer ID</Typography><div>{detail.companyId?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Company</Typography><div>{detail.name?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">License</Typography><div>{detail.license?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Address</Typography><div>{detail.address?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Status</Typography><div><Status value={detail.status}/></div></div><div><Typography variant="caption">Registered</Typography><div>{date(detail.createdAt)}</div></div></Stack></DialogContent><DialogActions><Button onClick={()=>setDetail(null)}>Close</Button></DialogActions></Dialog>}{action&&<RemarksDialog title={action.decision} close={()=>setAction(null)} submit={async remarks=>{await api.post(`${endpoint}/${action.row._id}/review`,{decision:action.decision,remarks});await list.reload()}}/>}</Stack>
);
}
