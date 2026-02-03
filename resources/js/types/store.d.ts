export interface Store {
    id: number;
    name: string;
    code: string;
    is_main: boolean;
    allow_direct_receipt: boolean;
    is_active: boolean;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
}
