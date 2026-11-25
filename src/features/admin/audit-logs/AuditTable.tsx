"use client";
import {useState} from 'react';
import {Paper,Stack,Button,TextField,Alert,Table,TableHead,TableBody,TableRow,TableCell,TableContainer,Dialog,DialogTitle,DialogContent,DialogActions,Typography} from '@mui/material';
import {api,errorText} from '@/api';
import {useAuth} from '@/context/Auth';
import {useList} from '@/features/shared/useList';
import {Status,Empty,Pagination,RemarksDialog,ActionDialog,date,ref} from '@/features/shared/TableUI';
import type {AuditRow} from './types';
import {endpoint} from './service';
export default function AuditTable(){const list=useList<AuditRow>(endpoint);const {user}=useAuth();const has=(p:string)=>!!user?.role.permissions.includes(p);const [search,S]=useState(''),[detail,setDetail]=useState<AuditRow|null>(null);
const rows=list.rows.filter(r=>JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));return (
<Stack spacing={2}><Stack direction="row" spacing={2}><TextField size="small" label="Search current page" value={search} onChange={e=>S(e.target.value)}/><Button onClick={list.reload}>Refresh</Button></Stack>{list.error&&<Alert severity="error">{list.error}</Alert>}<Paper variant="outlined"><TableContainer><Table><TableHead><TableRow>
<TableCell>Action</TableCell>
<TableCell>Entity</TableCell>
<TableCell>Record ID</TableCell>
<TableCell>Actor</TableCell>
<TableCell>Recorded</TableCell>
<TableCell>Actions</TableCell>
</TableRow></TableHead><TableBody>{list.busy||!rows.length?<Empty busy={list.busy} cols={6}/>:rows.map(r=><TableRow key={r._id}>
<TableCell>{r.action?.toLocaleString()??"—"}</TableCell>
<TableCell>{ref(r.entity)}</TableCell>
<TableCell>{r.entityId?.toLocaleString()??"—"}</TableCell>
<TableCell>{ref(r.actor)}</TableCell>
<TableCell>{date(r.createdAt)}</TableCell>
<TableCell><Stack direction="row" spacing={1}><Button size="small" onClick={()=>setDetail(r)}>View</Button></Stack></TableCell>
</TableRow>)}</TableBody></Table></TableContainer><Pagination list={list}/></Paper>{detail&&<Dialog open onClose={()=>setDetail(null)} fullWidth><DialogTitle>Audit details</DialogTitle><DialogContent><Stack spacing={2}><div><Typography variant="caption">Action</Typography><div>{detail.action?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Entity</Typography><div>{ref(detail.entity)}</div></div><div><Typography variant="caption">Record ID</Typography><div>{detail.entityId?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Actor</Typography><div>{ref(detail.actor)}</div></div><div><Typography variant="caption">Recorded</Typography><div>{date(detail.createdAt)}</div></div></Stack></DialogContent><DialogActions><Button onClick={()=>setDetail(null)}>Close</Button></DialogActions></Dialog>}</Stack>
);
}
