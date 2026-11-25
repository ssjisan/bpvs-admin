export type Row=Record<string,any>;export type User={_id:string;name:string;email:string;manufacturer?:string;role:{name:string;permissions:string[]}};
export const money=(v:number)=>v.toLocaleString('en-US');export const pretty=(s:string)=>s.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
