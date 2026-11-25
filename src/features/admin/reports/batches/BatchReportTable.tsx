"use client";
import {useState} from 'react';
import {Paper,Stack,Button,TextField,Alert,Table,TableHead,TableBody,TableRow,TableCell,TableContainer,Dialog,DialogTitle,DialogContent,DialogActions,Typography} from '@mui/material';
import {api,errorText} from '@/api';
import {useAuth} from '@/context/Auth';
import {useList} from '@/features/shared/useList';
import {Status,Empty,Pagination,RemarksDialog,ActionDialog,date,ref} from '@/features/shared/TableUI';
import type {BatchReportRow} from './types';
import {endpoint} from './service';
export default function BatchReportTable(){const list=useList<BatchReportRow>(endpoint);const {user}=useAuth();const has=(p:string)=>!!user?.role.permissions.includes(p);const [search,S]=useState(''),[detail,setDetail]=useState<BatchReportRow|null>(null);
const rows=list.rows.filter(r=>JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));return (
<Stack spacing={2}><Stack direction="row" spacing={2}><TextField size="small" label="Search current page" value={search} onChange={e=>S(e.target.value)}/><Button onClick={list.reload}>Refresh</Button></Stack>{list.error&&<Alert severity="error">{list.error}</Alert>}<Paper variant="outlined"><TableContainer><Table><TableHead><TableRow>
<TableCell>Batch ID</TableCell>
<TableCell>Manufacturer</TableCell>
<TableCell>Bag size</TableCell>
<TableCell>Approved / requested quantity</TableCell>
<TableCell>Reported printed</TableCell>
<TableCell>Distribution area</TableCell>
<TableCell>Status</TableCell>
<TableCell>Production status</TableCell>
<TableCell>Actions</TableCell>
</TableRow></TableHead><TableBody>{list.busy||!rows.length?<Empty busy={list.busy} cols={9}/>:rows.map(r=><TableRow key={r._id}>
<TableCell>{r.batchId?.toLocaleString()??"—"}</TableCell>
<TableCell>{ref(r.manufacturer)}</TableCell>
<TableCell>{r.bagSize?.toLocaleString()??"—"}</TableCell>
<TableCell>{r.quantity?.toLocaleString()??"—"}</TableCell>
<TableCell>{r.reportedPrinted?.toLocaleString()??"—"}</TableCell>
<TableCell>{r.distributionArea?.toLocaleString()??"—"}</TableCell>
<TableCell><Status value={r.status}/></TableCell>
<TableCell><Status value={r.productionStatus}/></TableCell>
<TableCell><Stack direction="row" spacing={1}><Button size="small" onClick={()=>setDetail(r)}>View</Button></Stack></TableCell>
</TableRow>)}</TableBody></Table></TableContainer><Pagination list={list}/></Paper>{detail&&<Dialog open onClose={()=>setDetail(null)} fullWidth><DialogTitle>BatchReport details</DialogTitle><DialogContent><Stack spacing={2}><div><Typography variant="caption">Batch ID</Typography><div>{detail.batchId?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Manufacturer</Typography><div>{ref(detail.manufacturer)}</div></div><div><Typography variant="caption">Bag size</Typography><div>{detail.bagSize?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Approved / requested quantity</Typography><div>{detail.quantity?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Reported printed</Typography><div>{detail.reportedPrinted?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Distribution area</Typography><div>{detail.distributionArea?.toLocaleString()??"—"}</div></div><div><Typography variant="caption">Status</Typography><div><Status value={detail.status}/></div></div><div><Typography variant="caption">Production status</Typography><div><Status value={detail.productionStatus}/></div></div></Stack></DialogContent><DialogActions><Button onClick={()=>setDetail(null)}>Close</Button></DialogActions></Dialog>}</Stack>
);
}
