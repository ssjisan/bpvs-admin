"use client";
import {useState} from 'react';
import {Paper,Stack,Button,TextField,Alert,Table,TableHead,TableBody,TableRow,TableCell,TableContainer,Dialog,DialogTitle,DialogContent,DialogActions,Typography} from '@mui/material';
import {api,errorText} from '@/api';
import {useAuth} from '@/context/Auth';
import {useList} from '@/features/shared/useList';
import {Status,Empty,Pagination,RemarksDialog,ActionDialog,date,ref} from '@/features/shared/TableUI';
import type {ProductionRow} from './types';
import {endpoint} from './service';
import ProductionForm from "./Form";
export default function ProductionTable(){const list=useList<ProductionRow>(endpoint);const {user}=useAuth();const has=(p:string)=>!!user?.role.permissions.includes(p);const [search,S]=useState(''),[detail,setDetail]=useState<ProductionRow|null>(null);const [form,setForm]=useState<ProductionRow|"new"|null>(null);
const rows=list.rows.filter(r=>JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));return (
<Stack spacing={2}><Stack direction="row" spacing={2}><TextField size="small" label="Search current page" value={search} onChange={e=>S(e.target.value)}/><Button onClick={list.reload}>Refresh</Button>{has("production.write.own")&&<Button onClick={()=>setForm("new")}>Create new</Button>}</Stack>{list.error&&<Alert severity="error">{list.error}</Alert>}<Paper variant="outlined"><TableContainer><Table><TableHead><TableRow>
<TableCell>Batch</TableCell>
<TableCell>Printed units</TableCell>
<TableCell>Source</TableCell>
<TableCell>Recorded</TableCell>
<TableCell>Actions</TableCell>
</TableRow></TableHead><TableBody>{list.busy||!rows.length?<Empty busy={list.busy} cols={5}/>:rows.map(r=><TableRow key={r._id}>
<TableCell>{ref(r.batch)}</TableCell>
<TableCell>{r.units?.toLocaleString()??"—"}</TableCell>
<TableCell>{r.source?.toLocaleString()??"—"}</TableCell>
<TableCell>{date(r.createdAt)}</TableCell>
<TableCell><Stack direction="row" spacing={1}><Button size="small" onClick={()=>setDetail(r)}>View</Button></Stack></TableCell>
</TableRow>)}</TableBody></Table></TableContainer><Pagination list={list}/></Paper>{detail&&<Dialog open onClose={()=>setDetail(null)} fullWidth><DialogTitle>Production details</DialogTitle><DialogContent><Stack spacing={2}><div><Typography variant="caption">Batch</Typography><div>{ref(detail.batch)}</div></div><div><Typography variant="caption">Printed units</Typography><div>{detail.units?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Source</Typography><div>{detail.source?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Recorded</Typography><div>{date(detail.createdAt)}</div></div></Stack></DialogContent><DialogActions><Button onClick={()=>setDetail(null)}>Close</Button></DialogActions></Dialog>}{form&&<ProductionForm record={form==="new"?undefined:form} close={()=>setForm(null)} reload={list.reload}/>}</Stack>
);
}
