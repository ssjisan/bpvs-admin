export interface ManufacturerReference {
    _id: string;
    name: string;
    companyId?: string;
}

export interface BatchRow {
    _id: string;
    batchId: string;
    manufacturer?: ManufacturerReference | string | null;
    bagSize: string;
    quantity: number;
    reportedPrinted: number;
    distributionArea: string;
    status: string;
    productionStatus: string;
    startDate?: string;
    endDate?: string;
    remarks?: string;
    createdAt?: string;
    updatedAt?: string;
}