"use client";
import {useState} from 'react';
import {Paper,Stack,Button,TextField,Alert,Table,TableHead,TableBody,TableRow,TableCell,TableContainer,Dialog,DialogTitle,DialogContent,DialogActions,Typography} from '@mui/material';
import {api,errorText} from '@/api';
import {useAuth} from '@/context/Auth';
import {useList} from '@/features/shared/useList';
import {Status,Empty,Pagination,RemarksDialog,ActionDialog,date,ref} from '@/features/shared/TableUI';
import type {ManufacturerReportRow} from './types';
import {endpoint} from './service';
export default function ManufacturerReportTable(){const list=useList<ManufacturerReportRow>(endpoint);const {user}=useAuth();const has=(p:string)=>!!user?.role.permissions.includes(p);const [search,S]=useState(''),[detail,setDetail]=useState<ManufacturerReportRow|null>(null);
const rows=list.rows.filter(r=>JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));return (
<Stack spacing={2}><Stack direction="row" spacing={2}><TextField size="small" label="Search current page" value={search} onChange={e=>S(e.target.value)}/><Button onClick={list.reload}>Refresh</Button></Stack>{list.error&&<Alert severity="error">{list.error}</Alert>}<Paper variant="outlined"><TableContainer><Table><TableHead><TableRow>
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
<TableCell><Stack direction="row" spacing={1}><Button size="small" onClick={()=>setDetail(r)}>View</Button></Stack></TableCell>
</TableRow>)}</TableBody></Table></TableContainer><Pagination list={list}/></Paper>{detail&&<Dialog open onClose={()=>setDetail(null)} fullWidth><DialogTitle>ManufacturerReport details</DialogTitle><DialogContent><Stack spacing={2}><div><Typography variant="caption">Manufacturer ID</Typography><div>{detail.companyId?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Company</Typography><div>{detail.name?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">License</Typography><div>{detail.license?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Address</Typography><div>{detail.address?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Status</Typography><div><Status value={detail.status}/></div></div><div><Typography variant="caption">Registered</Typography><div>{date(detail.createdAt)}</div></div></Stack></DialogContent><DialogActions><Button onClick={()=>setDetail(null)}>Close</Button></DialogActions></Dialog>}</Stack>
);
}
