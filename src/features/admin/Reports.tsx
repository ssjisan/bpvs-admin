"use client";import {useState} from "react";import {Stack,TextField,MenuItem} from "@mui/material";import type {User} from "@/types";
import R0 from "./reports/manufacturers/View";
import R1 from "./reports/batches/View";
import R2 from "./reports/approvals/View";
import R3 from "./reports/qr/View";
import R4 from "./reports/scans/View";
import R5 from "./reports/violations/View";
import R6 from "./reports/activity/View";
const reports=[{name:"manufacturers",Component:R0},{name:"batches",Component:R1},{name:"approvals",Component:R2},{name:"qr",Component:R3},{name:"scans",Component:R4},{name:"violations",Component:R5},{name:"activity",Component:R6}];export function Reports({user}:{user:User}){const [index,I]=useState(0);const Component=reports[index].Component;return <Stack spacing={2}><TextField select label="Report type" value={index} onChange={e=>I(Number(e.target.value))}>{reports.map((r,i)=><MenuItem key={r.name} value={i}>{r.name}</MenuItem>)}</TextField><Component key={index}/></Stack>}