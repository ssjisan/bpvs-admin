"use client";
import {useState} from 'react';
import {Paper,Stack,Button,TextField,Alert,Table,TableHead,TableBody,TableRow,TableCell,TableContainer,Dialog,DialogTitle,DialogContent,DialogActions,Typography} from '@mui/material';
import {api,errorText} from '@/api';
import {useAuth} from '@/context/Auth';
import {useList} from '@/features/shared/useList';
import {Status,Empty,Pagination,RemarksDialog,ActionDialog,date,ref} from '@/features/shared/TableUI';
import type {RoleRow} from './types';
import {endpoint} from './service';
import RoleForm from "./Form";
export default function RoleTable(){const list=useList<RoleRow>(endpoint);const {user}=useAuth();const has=(p:string)=>!!user?.role.permissions.includes(p);const [search,S]=useState(''),[detail,setDetail]=useState<RoleRow|null>(null);const [form,setForm]=useState<RoleRow|"new"|null>(null);
const rows=list.rows.filter(r=>JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));return (
<Stack spacing={2}><Stack direction="row" spacing={2}><TextField size="small" label="Search current page" value={search} onChange={e=>S(e.target.value)}/><Button onClick={list.reload}>Refresh</Button>{has("roles.manage")&&<Button onClick={()=>setForm("new")}>Create new</Button>}</Stack>{list.error&&<Alert severity="error">{list.error}</Alert>}<Paper variant="outlined"><TableContainer><Table><TableHead><TableRow>
<TableCell>Role</TableCell>
<TableCell>Permissions</TableCell>
<TableCell>Protected</TableCell>
<TableCell>Actions</TableCell>
</TableRow></TableHead><TableBody>{list.busy||!rows.length?<Empty busy={list.busy} cols={4}/>:rows.map(r=><TableRow key={r._id}>
<TableCell>{r.name?.toLocaleString()??"—"}</TableCell>
<TableCell>{r.permissions?.join(", ")||"—"}</TableCell>
<TableCell>{r.protected?"Yes":"No"}</TableCell>
<TableCell><Stack direction="row" spacing={1}><Button size="small" onClick={()=>setDetail(r)}>View</Button>{has("roles.manage")&&!r.protected&&<Button onClick={()=>setForm(r)}>Edit permissions</Button>}</Stack></TableCell>
</TableRow>)}</TableBody></Table></TableContainer><Pagination list={list}/></Paper>{detail&&<Dialog open onClose={()=>setDetail(null)} fullWidth><DialogTitle>Role details</DialogTitle><DialogContent><Stack spacing={2}><div><Typography variant="caption">Role</Typography><div>{detail.name?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Permissions</Typography><div>{detail.permissions?.join(", ")||"—"}</div></div><div><Typography variant="caption">Protected</Typography><div>{detail.protected?"Yes":"No"}</div></div></Stack></DialogContent><DialogActions><Button onClick={()=>setDetail(null)}>Close</Button></DialogActions></Dialog>}{form&&<RoleForm record={form==="new"?undefined:form} close={()=>setForm(null)} reload={list.reload}/>}</Stack>
);
}
