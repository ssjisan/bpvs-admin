"use client";
import {useEffect,useState,useCallback} from 'react';
import {api,errorText} from '@/api';
export function useList<T>(endpoint:string){const [rows,setRows]=useState<T[]>([]),[total,setTotal]=useState(0),[page,setPage]=useState(0),[limit,setLimit]=useState(20),[busy,setBusy]=useState(true),[error,setError]=useState('');const reload=useCallback(async()=>{setBusy(true);setError('');try{const {data}=await api.get<{items:T[];total:number}>(endpoint,{params:{page:page+1,limit}});setRows(data.items);setTotal(data.total)}catch(e){setError(errorText(e));setRows([]);setTotal(0)}finally{setBusy(false)}},[endpoint,page,limit]);useEffect(()=>{void reload()},[reload]);return {rows,total,page,setPage,limit,setLimit,busy,error,setError,reload}}
