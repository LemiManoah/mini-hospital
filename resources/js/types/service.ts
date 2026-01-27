export interface Service {
    id: number;
    service_type_id: number;
    name: string;
    description: string;
    cost: number;
    price: number;
    is_active: boolean;
    service_type: {
        id: number;
        name: string;
    }
}
