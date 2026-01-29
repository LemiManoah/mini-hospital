import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PatientVisit } from '@/types/visit';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Active Visits', href: '/visits' },
    { title: 'Visit Details', href: '#' },
];

export default function PatientVisitShow({ patientVisit }: { patientVisit: PatientVisit }) {
    const sortedNotes = [...(patientVisit.notes ?? [])].sort((a, b) => b.id - a.id);
    const latestNote = sortedNotes[0];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Visit ${patientVisit.visit_number}`} />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div>
                    <h1 className="text-2xl font-bold">Visit {patientVisit.visit_number}</h1>
                    <p className="text-sm text-muted-foreground">
                        {patientVisit.patient?.name ?? `${patientVisit.patient?.first_name ?? ''} ${patientVisit.patient?.last_name ?? ''}`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/visits">
                        <Button variant="outline">Back to Visits</Button>
                    </Link>
                    <Link href={`/consultations/create?visit_id=${patientVisit.id}`}>
                        <Button>Consult</Button>
                    </Link>
                </div>
            </div>

            <div className="m-2 grid gap-4 rounded border p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-semibold">{patientVisit.status?.name ?? '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Clinic</p>
                        <p className="font-semibold">{patientVisit.assigned_clinic?.name ?? '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Priority</p>
                        <p className="font-semibold capitalize">{patientVisit.priority_flag ?? '-'}</p>
                    </div>
                </div>

                <div className="rounded-md border p-4">
                    <h2 className="text-lg font-semibold mb-2">Diagnosis Summary</h2>
                    {latestNote ? (
                        <div className="space-y-2">
                            <p><span className="font-medium">Provisional:</span> {latestNote.provisional_diagnosis ?? '-'}</p>
                            <p><span className="font-medium">Final:</span> {latestNote.final_diagnosis ?? '-'}</p>
                            <p><span className="font-medium">Plan:</span> {latestNote.plan ?? '-'}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No consultation notes yet.</p>
                    )}
                </div>

                <div className="rounded-md border p-4">
                    <h2 className="text-lg font-semibold mb-2">Consultation Notes</h2>
                    {sortedNotes.length > 0 ? (
                        <div className="space-y-4">
                            {sortedNotes.map((note) => (
                                <div key={note.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                                    <p className="text-sm text-muted-foreground">Doctor: {note.doctor?.name ?? '-'}</p>
                                    <p className="mt-1"><span className="font-medium">Complaint:</span> {note.complaint ?? '-'}</p>
                                    <p><span className="font-medium">Examination:</span> {note.examination ?? '-'}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No notes recorded.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
