export interface ProductionRow { _id:string; batch?:string | {_id?:string;name?:string;batchId?:string}; units?:number; source?:string; createdAt?:string; startDate?:string; endDate?:string }
