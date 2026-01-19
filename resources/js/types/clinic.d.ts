export interface Clinic {
    id: number;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface PaginatedClinics {
    data: Clinic[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}