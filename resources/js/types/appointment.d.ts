import { Patient } from './patient';

export interface Appointment {
    id: number;
    appointment_date: string;
    appointment_time: string;
    duration_minutes?: number;
    priority_flag?: string;
    status: string;
    appointment_method_id?: number | null;
    appointment_category_id?: number | null;
    clinic_id?: number | null;
    service_id?: number | null;
    virtual_link?: string | null;
    platform?: string | null;
    notes?: string;
    created_at: string;
    updated_at: string;
    patient: Patient;
    doctor: {
        id: number;
        name: string;
    };
    method?: {
        id: number;
        name: string;
    } | null;
    category?: {
        id: number;
        name: string;
    } | null;
    clinic?: {
        id: number;
        name: string;
    } | null;
    service?: {
        id: number;
        name: string;
    } | null;
}

export interface PaginatedAppointments {
    data: Appointment[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}
