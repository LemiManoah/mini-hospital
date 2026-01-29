export interface LabServiceCategory {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface LabSampleType {
    id: number;
    name: string;
    code: string;
    description?: string;
    default_container?: string;
    default_volume?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface LabResultOption {
    id: number;
    lab_test_id: number;
    option_value: string;
    label: string;
    is_abnormal: boolean;
    sort_order: number;
    lab_test?: {
        id: number;
        name: string;
    };
    created_at?: string;
    updated_at?: string;
}

export interface LabSample {
    id: number;
    sample_number: string;
    visit_order_item_id: number;
    sample_type_id: number;
    collected_by?: number;
    collected_at?: string;
    container?: string;
    volume?: string;
    status: 'collected' | 'received' | 'rejected';
    rejection_reason?: string;
    received_by?: number;
    received_at?: string;
    created_at?: string;
    updated_at?: string;
    visitOrderItem?: {
        id: number;
        quantity?: number;
        price?: number;
        service?: {
            id: number;
            name: string;
        };
    };
    sampleType?: LabSampleType;
    collectedBy?: {
        id: number;
        name: string;
    };
    receivedBy?: {
        id: number;
        name: string;
    };
}

export interface LabService {
    id: number;
    lab_service_category_id: number;
    name: string;
    code: string;
    description?: string;
    price: number;
    sample_type_code?: string;
    result_fields?: Array<{
        name: string;
        label: string;
        unit: string;
        type: string;
    }>;
    reference_range?: string;
    clinical_notes?: string;
    is_active: boolean;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;
    labServiceCategory?: LabServiceCategory;
    sampleType?: LabSampleType;
    lab_service_category?: LabServiceCategory;
    sample_type?: LabSampleType;
    resultOptions?: LabResultOption[];
    createdBy?: {
        id: number;
        name: string;
    };
    updatedBy?: {
        id: number;
        name: string;
    };
}
