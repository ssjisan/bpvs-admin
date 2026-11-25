"use client";
import {useState} from 'react';
import {Paper,Stack,Button,TextField,Alert,Table,TableHead,TableBody,TableRow,TableCell,TableContainer,Dialog,DialogTitle,DialogContent,DialogActions,Typography} from '@mui/material';
import {api,errorText} from '@/api';
import {useAuth} from '@/context/Auth';
import {useList} from '@/features/shared/useList';
import {Status,Empty,Pagination,RemarksDialog,ActionDialog,date,ref} from '@/features/shared/TableUI';
import type {UserRow} from './types';
import {endpoint} from './service';
import UserForm from "./Form";
export default function UserTable(){const list=useList<UserRow>(endpoint);const {user}=useAuth();const has=(p:string)=>!!user?.role.permissions.includes(p);const [search,S]=useState(''),[detail,setDetail]=useState<UserRow|null>(null);const [action,setAction]=useState<UserRow|null>(null);const [form,setForm]=useState<UserRow|"new"|null>(null);
const rows=list.rows.filter(r=>JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));return (
<Stack spacing={2}><Stack direction="row" spacing={2}><TextField size="small" label="Search current page" value={search} onChange={e=>S(e.target.value)}/><Button onClick={list.reload}>Refresh</Button>{has("users.manage")&&<Button onClick={()=>setForm("new")}>Create new</Button>}</Stack>{list.error&&<Alert severity="error">{list.error}</Alert>}<Paper variant="outlined"><TableContainer><Table><TableHead><TableRow>
<TableCell>Name</TableCell>
<TableCell>Email</TableCell>
<TableCell>Role</TableCell>
<TableCell>Active</TableCell>
<TableCell>Created</TableCell>
<TableCell>Actions</TableCell>
</TableRow></TableHead><TableBody>{list.busy||!rows.length?<Empty busy={list.busy} cols={6}/>:rows.map(r=><TableRow key={r._id}>
<TableCell>{r.name?.toLocaleString()??"—"}</TableCell>
<TableCell>{r.email?.toLocaleString()??"—"}</TableCell>
<TableCell>{ref(r.role)}</TableCell>
<TableCell>{r.active?"Yes":"No"}</TableCell>
<TableCell>{date(r.createdAt)}</TableCell>
<TableCell><Stack direction="row" spacing={1}><Button size="small" onClick={()=>setDetail(r)}>View</Button>{has("users.manage")&&r._id!==user?._id&&<Button onClick={()=>setAction(r)}>{r.active?"Deactivate":"Activate"}</Button>}</Stack></TableCell>
</TableRow>)}</TableBody></Table></TableContainer><Pagination list={list}/></Paper>{detail&&<Dialog open onClose={()=>setDetail(null)} fullWidth><DialogTitle>User details</DialogTitle><DialogContent><Stack spacing={2}><div><Typography variant="caption">Name</Typography><div>{detail.name?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Email</Typography><div>{detail.email?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Role</Typography><div>{ref(detail.role)}</div></div><div><Typography variant="caption">Active</Typography><div>{detail.active?"Yes":"No"}</div></div><div><Typography variant="caption">Created</Typography><div>{date(detail.createdAt)}</div></div></Stack></DialogContent><DialogActions><Button onClick={()=>setDetail(null)}>Close</Button></DialogActions></Dialog>}{action&&<ActionDialog title={action.active?"Deactivate user":"Activate user"} close={()=>setAction(null)} submit={async()=>{await api.patch(`/users/${action._id}/status`,{active:!action.active});await list.reload()}}/>}{form&&<UserForm record={form==="new"?undefined:form} close={()=>setForm(null)} reload={list.reload}/>}</Stack>
);
}
