export interface UserRow { _id:string; name?:string; email?:string; role?:string | {_id?:string;name?:string;batchId?:string}; active?:boolean; createdAt?:string; startDate?:string; endDate?:string }
