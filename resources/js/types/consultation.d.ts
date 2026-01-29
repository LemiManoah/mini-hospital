export type ConsultationVisit = {
    id: number;
    visit_number: string;
    visit_date?: string;
    visit_time?: string;
    priority_flag?: string;
    patient?: {
        id: number;
        first_name?: string;
        last_name?: string;
        name?: string;
        phone_number?: string;
    };
    status?: {
        id: number;
        name: string;
        code: string;
    };
    assigned_clinic?: {
        id: number;
        name: string;
    };
    assigned_doctor?: {
        id: number;
        name: string;
    };
};

export type VisitNote = {
    id: number;
    visit_id: number;
    complaint?: string | null;
    examination?: string | null;
    provisional_diagnosis?: string | null;
    final_diagnosis?: string | null;
    plan?: string | null;
    visit?: ConsultationVisit;
    doctor?: {
        id: number;
        name: string;
    };
};
