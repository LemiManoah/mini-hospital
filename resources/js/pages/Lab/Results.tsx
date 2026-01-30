import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, ClipboardCheck, Printer, Search } from 'lucide-react';
import { useState } from 'react';
import LabResultEntryModal from '@/components/LabResultEntryModal';

interface VisitResult {
    id: number;
    result_payload?: any;
    recorded_by?: number | null;
    verified_by?: number | null;
    verified_at?: string | null;
}

interface LabResultItem {
    id: number;
    visit_order_id: number;
    item_id: number;
    labService?: any;
    lab_service?: any;
    service?: any;
    item?: any;
    labSample?: {
        id: number;
        sample_number: string;
        status: string;
    };
    result?: VisitResult | null;
}

interface LabResultGroup {
    patient: any;
    visit: any;
    orders: any[];
    all_items: LabResultItem[];
}

interface Props {
    labResults: {
        data: LabResultGroup[];
        links: Array<{ url?: string; label: string; active: boolean }>;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Lab Results', href: '/lab/results' },
];

const resultStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    entered: 'bg-blue-100 text-blue-800',
    verified: 'bg-green-100 text-green-800',
};

export default function LabResults({ labResults, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const nextStatus = status === 'all' ? '' : status;
        router.get('/lab/results', { search, status: nextStatus }, { preserveState: true, replace: true });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        const nextStatus = value === 'all' ? '' : value;
        router.get('/lab/results', { search, status: nextStatus }, { preserveState: true, replace: true });
    };

    const getPatientName = (patient: any) => {
        return patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
    };

    const getResultStatus = (item: LabResultItem) => {
        if (!item.result) return 'pending';
        if (item.result.verified_at) return 'verified';
        return 'entered';
    };

    const getResultSummary = (item: LabResultItem) => {
        if (!item.result?.result_payload) return '—';
        const payload = typeof item.result.result_payload === 'string'
            ? (() => {
                try {
                    return JSON.parse(item.result.result_payload);
                } catch {
                    return null;
                }
            })()
            : item.result.result_payload;

        if (!payload) return '—';

        const format = payload.result_format;
        const values = payload.payload || {};
        if (format === 'simple_options') {
            return values.option_name || 'Option selected';
        }
        if (format === 'parameter_based' || format === 'complex_hormone') {
            const filled = Array.isArray(values.parameters)
                ? values.parameters.filter((entry: any) => entry.value !== null && entry.value !== '').length
                : 0;
            return `${filled} parameter(s) entered`;
        }
        if (format === 'custom_fields') {
            const entries = values.fields ? Object.values(values.fields).filter((v: any) => v !== '' && v !== null) : [];
            return `${entries.length} field(s) entered`;
        }
        return values.value ? 'Result recorded' : 'Result entered';
    };

    const resolveService = (item: LabResultItem) =>
        item.labService || item.lab_service || item.service || item.item || null;

    const handleVerify = (item: LabResultItem) => {
        router.put(`/lab/results/items/${item.id}/verify`, {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lab Results" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Lab Results</h1>
            </div>

            <div className="m-2 space-y-4">
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search patient name, visit, or order number..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="max-w-md"
                                />
                            </div>
                            <Select value={status} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-44">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Results</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="entered">Entered</SelectItem>
                                    <SelectItem value="verified">Verified</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit" variant="outline">
                                <Search className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {labResults.data.map((group) => {
                        const patientName = getPatientName(group.patient);
                        const visitDate = group.visit?.visit_date ? new Date(group.visit.visit_date).toLocaleDateString() : '—';
                        const visitTime = group.visit?.visit_time || '—';
                        return (
                            <Card key={group.visit.id}>
                                <CardHeader className="space-y-3">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{patientName}</CardTitle>
                                            <div className="text-sm text-muted-foreground">
                                                Patient ID {group.patient.id} • Visit {group.visit.visit_number}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/lab/results/visit/${group.visit.id}/print`} target="_blank">
                                                    <Printer className="h-3 w-3 mr-1" />
                                                    Print Report
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Patient ID</Label>
                                            <div className="font-medium">{group.patient.id}</div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Patient Name</Label>
                                            <div className="font-medium">{patientName}</div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Age / Gender</Label>
                                            <div className="font-medium">
                                                {group.patient.age ? `${group.patient.age} Year(s)` : '—'} • {group.patient.gender || '—'}
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Visit Date</Label>
                                            <div className="font-medium">{visitDate}</div>
                                            <div className="text-xs text-muted-foreground">{visitTime}</div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-lg border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12">S/N</TableHead>
                                                    <TableHead>Service Name</TableHead>
                                                    <TableHead>Sample</TableHead>
                                                    <TableHead>Result</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {group.all_items.map((item, index) => {
                                                    const service = resolveService(item);
                                                    const statusKey = getResultStatus(item);
                                                    return (
                                                        <TableRow key={item.id}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>
                                                                <div className="font-medium">
                                                                    {service?.name || `No Lab Service (ID: ${item.item_id})`}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {service?.code || '—'}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm">{item.labSample?.sample_number || '—'}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {item.labSample?.status || 'No sample'}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm">{getResultSummary(item)}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge className={resultStatusColors[statusKey as keyof typeof resultStatusColors]}>
                                                                    {statusKey}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-wrap gap-2">
                                                                    <LabResultEntryModal
                                                                        item={item}
                                                                        patient={group.patient}
                                                                        visit={group.visit}
                                                                        disabled={Boolean(item.result?.verified_at)}
                                                                        onSuccess={() => window.location.reload()}
                                                                    />
                                                                    {item.result && !item.result.verified_at && (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="secondary"
                                                                            onClick={() => handleVerify(item)}
                                                                        >
                                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                                            Verify
                                                                        </Button>
                                                                    )}
                                                                    {item.result?.verified_at && (
                                                                        <Badge variant="outline" className="text-xs">
                                                                            <ClipboardCheck className="h-3 w-3 mr-1" />
                                                                            Verified
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                                {group.all_items.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                                                            No lab services found for this patient.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {labResults.links?.length > 0 && (
                    <div className="flex justify-center">
                        <div className="flex gap-1">
                            {labResults.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-2 text-sm rounded ${
                                        link.active
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
