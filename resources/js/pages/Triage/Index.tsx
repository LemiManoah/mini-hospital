import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { TriageVisit, VisitTriage } from '@/types/triage';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Triage', href: '/triage' },
];

export default function TriageIndex({
    queueVisits,
    triageRecords,
    filters,
}: {
    queueVisits: TriageVisit[];
    triageRecords: { data: VisitTriage[]; links: Array<{ url?: string; label: string; active: boolean }> };
    filters: { search?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/triage', { search }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Triage" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Triage Queue</h1>
                <Link href="/triage/create">
                    <Button>+ Triage Patient</Button>
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
                                            <Link href={`/triage/create?visit_id=${visit.id}`}>
                                                <Button size="sm" variant="outline">Record Triage</Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4">
                                        No visits waiting for triage.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="mt-8 mb-4 flex items-center justify-between gap-2 px-4">
                <h2 className="text-xl font-semibold">Recent Triage Records</h2>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Visit No.</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Vitals</TableHead>
                                <TableHead>Triaged At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {triageRecords.data.length > 0 ? (
                                triageRecords.data.map((triage) => (
                                    <TableRow key={triage.id}>
                                        <TableCell className="font-medium">{triage.visit?.visit_number ?? '-'}</TableCell>
                                        <TableCell>
                                            {triage.visit?.patient?.name ??
                                                (`${triage.visit?.patient?.first_name ?? ''} ${triage.visit?.patient?.last_name ?? ''}`.trim() ||
                                                    '-')}
                                        </TableCell>
                                        <TableCell>
                                            {triage.vitals_json?.bp ? `BP ${triage.vitals_json.bp}` : 'BP -'}
                                            {triage.vitals_json?.hr ? `, HR ${triage.vitals_json.hr}` : ''}
                                            {triage.vitals_json?.temp ? `, Temp ${triage.vitals_json.temp}` : ''}
                                        </TableCell>
                                        <TableCell>{triage.triage_at ? new Date(triage.triage_at).toLocaleString() : '-'}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Link href={`/triage/${triage.id}/edit`}>
                                                <Button size="sm" variant="outline">Edit</Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4">
                                        No triage records found.
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
