import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { ConsultationVisit, VisitNote } from '@/types/consultation';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Consultations', href: '/consultations' },
];

export default function ConsultationIndex({
    queueVisits,
    consultationNotes,
    filters,
}: {
    queueVisits: ConsultationVisit[];
    consultationNotes: { data: VisitNote[]; links: Array<{ url?: string; label: string; active: boolean }> };
    filters: { search?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/consultations', { search }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Consultations" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Doctor Queue</h1>
                <Link href="/consultations/create">
                    <Button>+ New Consultation</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <Input
                        placeholder="Search visit number or patient name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                    <Button type="submit" variant="outline">
                        <Search className="mr-2 h-4 w-4" />
                        Search
                    </Button>
                </form>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Visit No.</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Clinic</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {queueVisits.length > 0 ? (
                                queueVisits.map((visit) => (
                                    <TableRow key={visit.id}>
                                        <TableCell className="font-medium">{visit.visit_number}</TableCell>
                                        <TableCell>{visit.patient?.name ?? `${visit.patient?.first_name ?? ''} ${visit.patient?.last_name ?? ''}`}</TableCell>
                                        <TableCell>{visit.assigned_clinic?.name ?? '-'}</TableCell>
                                        <TableCell>{visit.status?.name ?? '-'}</TableCell>
                                        <TableCell className="capitalize">{visit.priority_flag ?? '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/consultations/create?visit_id=${visit.id}`}>
                                                <Button size="sm" variant="outline">Open</Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4">
                                        No visits waiting for consultation.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="mt-8 mb-4 flex items-center justify-between gap-2 px-4">
                <h2 className="text-xl font-semibold">Recent Consultations</h2>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Visit No.</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Diagnosis</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {consultationNotes.data.length > 0 ? (
                                consultationNotes.data.map((note) => (
                                    <TableRow key={note.id}>
                                        <TableCell className="font-medium">{note.visit?.visit_number ?? '-'}</TableCell>
                                        <TableCell>{note.visit?.patient?.name ?? '-'}</TableCell>
                                        <TableCell>{note.doctor?.name ?? '-'}</TableCell>
                                        <TableCell>{note.final_diagnosis ?? note.provisional_diagnosis ?? '-'}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Link href={`/consultations/${note.id}/edit`}>
                                                <Button size="sm" variant="outline">Edit</Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4">
                                        No consultation notes found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
