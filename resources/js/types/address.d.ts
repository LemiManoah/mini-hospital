export interface Address {
    id: number;
    district: string;
    city?: string;
    county?: string;
    created_at: string;
    updated_at: string;
}

export type PaginatorLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    data: T[];
    current_page: number;
    first_page_url: string;
    from?: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginatorLink[];
    next_page_url?: string | null;
    path: string;
    per_page: number;
    prev_page_url?: string | null;
    to?: number | null;
    total?: number;
};

export type PaginatedAddress = Paginated<Address>;