import axios from 'axios';
const baseURL=process.env.NEXT_PUBLIC_API_URL||'http://localhost:8080/api/v1';
export const publicApi=axios.create({baseURL,timeout:20000});
export const api=axios.create({baseURL,timeout:20000});
export function saveTokens(d:{accessToken:string;refreshToken:string}){localStorage.setItem('bpvs.access',d.accessToken);localStorage.setItem('bpvs.refresh',d.refreshToken)}
export function clearTokens(){localStorage.removeItem('bpvs.access');localStorage.removeItem('bpvs.refresh')}
api.interceptors.request.use(c=>{const t=localStorage.getItem('bpvs.access');if(t)c.headers.Authorization=`Bearer ${t}`;return c});
let refreshing:Promise<void>|null=null;
api.interceptors.response.use(r=>r,async e=>{const c=e.config;if(e.response?.status!==401||!c||c._retried)throw e;c._retried=true;try{if(!refreshing)refreshing=(async()=>{const refreshToken=localStorage.getItem('bpvs.refresh');if(!refreshToken)throw Error('Session expired');const {data}=await publicApi.post('/auth/refresh',{refreshToken});saveTokens(data)})().finally(()=>{refreshing=null});await refreshing;return api(c)}catch(err){clearTokens();window.dispatchEvent(new Event('bpvs:logout'));throw err}});
export function errorText(e:unknown){if(axios.isAxiosError(e)){const d=e.response?.data;return d?.issues?.map((i:{path:string[];message:string})=>`${i.path.join('.')}: ${i.message}`).join('; ')||d?.message||e.message}return e instanceof Error?e.message:'Request failed'}
