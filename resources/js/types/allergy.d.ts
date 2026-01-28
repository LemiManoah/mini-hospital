export interface Allergy {
    id: number;
    name: string;
    description?: string;
    severity: 'mild' | 'moderate' | 'severe';
    reaction_type?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
    links: Array<{
        url?: string;
        label: string;
        active: boolean;
    }>;
    prev_page_url?: string;
    next_page_url?: string;
}
