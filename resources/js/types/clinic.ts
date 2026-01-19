export interface Clinic {
    id: number;
    name: string;
    status: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export interface PaginatedClinic {
    data: Clinic[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url?: string;
    next_page_url?: string;
    links: Array<{
        url?: string;
        label: string;
        active: boolean;
    }>;
}
