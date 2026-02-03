export interface InventoryItem {
    id: number;
    name: string;
    generic_name?: string | null;
    code: string;
    item_type: 'drug' | 'consumable' | 'general_supply';
    item_category_id: number;
    unit_of_measure: string;
    is_controlled: boolean;
    is_expirable: boolean;
    default_expiry_date?: string | null;
    min_stock?: number | null;
    reorder_level?: number | null;
    cost_price?: number | string | null;
    selling_price?: number | string | null;
    is_active: boolean;
    notes?: string | null;
    category?: {
        id: number;
        name: string;
    };
    created_at?: string;
    updated_at?: string;
}

export interface PaginatedInventoryItems {
    data: InventoryItem[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}
