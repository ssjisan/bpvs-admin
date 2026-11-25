export interface ApprovalRow {
    _id: string;

    entityType: string;

    entity: string;

    recordName?: string;

    reviewedBy?: string;

    actor?: {
        _id: string;
        name: string;
        email?: string;
    } | string | null;

    record?: {
        _id: string;
        name?: string;
        companyId?: string;
        batchId?: string;
        bagSize?: string;
        quantity?: number;
        manufacturer?: {
            _id: string;
            name: string;
            companyId?: string;
        };
    } | null;

    decision: string;

    remarks: string;

    createdAt: string;
}