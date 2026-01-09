export interface PatientCategory {
    id: number;
    name: string;
    is_insurance: boolean;
    is_active?: boolean;
    created_at: string;
    updated_at: string;
}