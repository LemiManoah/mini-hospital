import { Patient } from './patient';

export interface Appointment {
    id: number;
    appointment_date: string;
    appointment_time: string;
    status: string;
    patient: Patient;
    doctor: {
        id: number;
        name: string;
    };
}

export interface PaginatedAppointments {
    data: Appointment[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}
