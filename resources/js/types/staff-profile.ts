export interface StaffProfile {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    staff_number: string;
    gender: string;
    phone_number: string;
    alternative_phone_number?: string;
    user_id: number;
    clinic_id?: number;
    address_id?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    
    // Relationships
    user?: {
        id: number;
        name: string;
        email: string;
    };
    clinic?: {
        id: number;
        name: string;
        status: string;
    };
    address?: {
        id: number;
        district: string;
        city: string;
        county: string;
        display_name?: string;
    };
}

export interface PaginatedStaffProfile {
    data: StaffProfile[];
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
