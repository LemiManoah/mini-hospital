import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { LabSample } from '@/types/lab';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Lab Samples', href: '/lab-samples' },
];

export default function LabSampleIndex({
    labSamples,
    filters,
}: {
    labSamples: { data: LabSample[]; links: Array<{ url?: string; label: string; active: boolean }> };
    filters: { search?: string; status?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const nextStatus = status === 'all' ? '' : status;
        router.get('/lab-samples', { search, status: nextStatus }, { preserveState: true, replace: true });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        const nextStatus = value === 'all' ? '' : value;
        router.get('/lab-samples', { search, status: nextStatus }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lab Samples Report" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Lab Samples Report</h1>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <Input
                        placeholder="Search sample number or type"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="collected">Collected</SelectItem>
                            <SelectItem value="received">Received</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button type="submit" variant="outline">
                        <Search className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                </form>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Sample Number</TableHead>
                            <TableHead>Patient</TableHead>
                            <TableHead>Test</TableHead>
                            <TableHead>Sample Type</TableHead>
                            <TableHead>Container</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Collected By</TableHead>
                            <TableHead>Collected At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {labSamples.data.map((sample, index) => (
                            <TableRow key={sample.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">{sample.sample_number}</TableCell>
                                <TableCell>{sample.visitOrderItem?.order?.visit?.patient?.name ?? '-'}</TableCell>
                                <TableCell>{sample.visitOrderItem?.service?.name ?? '-'}</TableCell>
                                <TableCell>{sample.sampleType?.name ?? '-'}</TableCell>
                                <TableCell>{sample.container ?? '-'}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        sample.status === 'collected' ? 'bg-blue-100 text-blue-800' :
                                        sample.status === 'received' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {sample.status}
                                    </span>
                                </TableCell>
                                <TableCell>{sample.collectedBy?.name ?? '-'}</TableCell>
                                <TableCell>{sample.collected_at ? new Date(sample.collected_at).toLocaleString() : '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
