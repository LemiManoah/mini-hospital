import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { PaginatedVisits, PatientVisit } from '@/types/visit';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Active Visits', href: '/visits' },
];

export default function PatientVisitIndex({
    patientVisits,
    filters,
}: {
    patientVisits: PaginatedVisits;
    filters: { search?: string; filter?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/visits', { search }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Active Visits" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Active Visits</h1>
                <Link href="/patient-visits/create">
                    <Button>+ New Visit</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <Input
                        placeholder="Search visit number or patient"
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
                                <TableHead>Status</TableHead>
                                <TableHead>Clinic</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patientVisits.data.length > 0 ? (
                                patientVisits.data.map((visit: PatientVisit) => (
                                    <TableRow key={visit.id}>
                                        <TableCell className="font-medium">{visit.visit_number}</TableCell>
                                        <TableCell>{visit.patient?.name ?? `${visit.patient?.first_name ?? ''} ${visit.patient?.last_name ?? ''}`}</TableCell>
                                        <TableCell>{visit.status?.name ?? '-'}</TableCell>
                                        <TableCell>{visit.assigned_clinic?.name ?? '-'}</TableCell>
                                        <TableCell className="capitalize">{visit.priority_flag ?? '-'}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Link href={`/visits/${visit.id}`}>
                                                <Button size="sm" variant="outline">View</Button>
                                            </Link>
                                            <Link href={`/consultations/create?visit_id=${visit.id}`}>
                                                <Button size="sm" variant="outline">Consult</Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4">
                                        No active visits found.
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
