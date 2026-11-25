'use client';
import {useEffect,useState,type FormEvent,type ReactNode} from 'react';
import {ThemeProvider,CssBaseline,Box,Paper,Typography,Button,TextField,Alert,Stack,Chip,Table,TableBody,TableCell,TableHead,TableRow,TableContainer,TablePagination,Dialog,DialogTitle,DialogContent,DialogActions,MenuItem,Checkbox,FormControlLabel,CircularProgress,IconButton,Drawer,Divider} from '@mui/material';
import {DashboardOutlined,FactoryOutlined,Inventory2Outlined,QrCode2Outlined,AssessmentOutlined,PeopleOutline,SettingsOutlined,ShieldOutlined,HistoryOutlined,Logout,Menu,NotificationsOutlined,Refresh,Add,Download,Visibility,PersonOutline} from '@mui/icons-material';
import {ResponsiveContainer,AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,PieChart,Pie,Cell} from 'recharts';
export function Brand(){return <div className="brand"><img src="/brand.svg" alt="BPVS project mark"/><div><Typography fontWeight={750}>BPVS</Typography><Typography variant="caption" className="muted">Department of Environment</Typography></div></div>}
