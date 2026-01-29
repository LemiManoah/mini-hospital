export type TriageVitals = {
    bp?: string | null;
    hr?: string | null;
    temp?: string | null;
    spo2?: string | null;
    weight?: string | null;
    height?: string | null;
};

export type TriageVisit = {
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
};

export type VisitTriage = {
    id: number;
    visit_id: number;
    vitals_json?: TriageVitals | null;
    triage_notes?: string | null;
    triage_by?: number | null;
    triage_at?: string | null;
    visit?: TriageVisit;
    triaged_by?: {
        id: number;
        name: string;
    };
};
