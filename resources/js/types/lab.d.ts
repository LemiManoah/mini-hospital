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
    lab_service_id: number;
    lab_result_type_id?: number | null;
    option_name: string;
    option_code?: string | null;
    symbol?: string | null;
    is_abnormal: boolean;
    display_order: number;
    is_active: boolean;
    labService?: {
        id: number;
        name: string;
        code?: string;
    };
    labResultType?: {
        id: number;
        name: string;
        code: string;
        result_format: string;
    };
    created_at?: string;
    updated_at?: string;
}

export interface LabReferenceRange {
    id: number;
    lab_result_parameter_id: number;
    age_range_from?: string | null;
    age_range_to?: string | null;
    sex: 'male' | 'female' | 'both';
    phase?: string | null;
    weeks_from?: string | null;
    weeks_to?: string | null;
    min_value?: number | null;
    max_value?: number | null;
    reference_text?: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface LabResultParameter {
    id: number;
    lab_service_id: number;
    parameter_name: string;
    parameter_code?: string | null;
    unit?: string | null;
    is_active: boolean;
    display_order: number;
    referenceRanges?: LabReferenceRange[];
    created_at?: string;
    updated_at?: string;
}

export interface LabResultType {
    id: number;
    name: string;
    code: string;
    result_format: 'machine_based' | 'simple_options' | 'parameter_based' | 'complex_hormone';
    description?: string | null;
    is_active: boolean;
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
    sample_type_id?: number;
    lab_result_type_id?: number;
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
    labResultType?: LabResultType;
    resultOptions?: LabResultOption[];
    resultParameters?: LabResultParameter[];
    createdBy?: {
        id: number;
        name: string;
    };
    updatedBy?: {
        id: number;
        name: string;
    };
}
