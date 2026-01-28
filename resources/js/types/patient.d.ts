import { Country } from "./country";
import { Address } from "./address";
import { PatientCategory } from "./patient-category";
import { Allergy } from "./allergy";

export interface Patient {
    id: number;
    patient_number: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    marital_status: string;
    preferred_language: string;
    religion: string;
    country_id: number;
    address_id: number;
    patient_category_id: number;
    registration_date: string;
    phone_number: string;
    alternative_phone_number: string;
    phone_owner: boolean;
    next_of_kin_name: string;
    next_of_kin_number: string;
    next_of_kin_relationship: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    country: Country;
    address: Address;
    patient_category: PatientCategory;
    allergies: Array<Allergy & {
        pivot: {
            notes?: string;
            diagnosed_date?: string;
            severity: string;
            is_active: boolean;
        };
    }>;
}

export interface PaginatedPatients {
    data: Patient[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}
