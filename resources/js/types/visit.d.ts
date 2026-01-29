export type VisitStatus = {
    id: number;
    name: string;
    code: string;
};

export type VisitClinic = {
    id: number;
    name: string;
};

export type VisitDoctor = {
    id: number;
    name: string;
};

export type VisitPatient = {
    id: number;
    first_name?: string;
    last_name?: string;
    name?: string;
    phone_number?: string;
};

export type VisitNote = {
    id: number;
    complaint?: string | null;
    examination?: string | null;
    provisional_diagnosis?: string | null;
    final_diagnosis?: string | null;
    plan?: string | null;
    doctor?: {
        id: number;
        name: string;
    };
};

export type PatientVisit = {
    id: number;
    visit_number: string;
    visit_date?: string;
    visit_time?: string;
    priority_flag?: string;
    patient?: VisitPatient;
    status?: VisitStatus;
    assigned_clinic?: VisitClinic;
    assigned_doctor?: VisitDoctor;
    notes?: VisitNote[];
};

export type PaginatedVisits = {
    data: PatientVisit[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
};
