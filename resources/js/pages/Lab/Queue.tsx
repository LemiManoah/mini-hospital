import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, Search, TestTube, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import SamplePickModal from '@/components/SamplePickModal';

interface LabOrder {
    patient: {
        id: number;
        name: string;
        first_name: string;
        last_name: string;
        age?: number;
        gender?: string;
    };
    visit: {
        id: number;
        visit_number: string;
        assigned_clinic?: {
            name: string;
        };
    };
    orders: Array<{
        id: number;
        order_number: string;
        status: string;
        priority: string;
        requested_at: string;
    }>;
    all_items: Array<{
        id: number;
        visit_order_id: number;
        item_type: string;
        item_id: number;
        qty: number;
        price: number;
        labService: {
            id: number;
            name: string;
            code: string;
            price: number;
            sampleType?: {
                name: string;
                code: string;
                default_container: string;
            };
        };
        lab_service?: {
            id: number;
            name: string;
            code: string;
            price: number;
            sample_type?: {
                name: string;
                code: string;
                default_container: string;
            };
        };
        service?: {
            id: number;
            name: string;
            code?: string;
            price?: number;
        };
        item?: {
            id: number;
            name: string;
            code?: string;
            price?: number;
        };
        labSample?: {
            id: number;
            sample_number: string;
            status: string;
        };
    }>;
    total_items: number;
}

interface Props {
    labQueue: {
        data: LabOrder[];
        links: Array<{ url?: string; label: string; active: boolean }>;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Lab Queue', href: '/lab/queue' },
];

const statusColors = {
    requested: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function LabQueue({ labQueue, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const nextStatus = status === 'all' ? '' : status;
        router.get('/lab/queue', { search, status: nextStatus }, { preserveState: true, replace: true });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        const nextStatus = value === 'all' ? '' : value;
        router.get('/lab/queue', { search, status: nextStatus }, { preserveState: true, replace: true });
    };

    const updateOrderStatus = (orderId: number, newStatus: string) => {
        router.put(`/visit-orders/${orderId}/status`, { status: newStatus }, {
            onSuccess: () => {
                console.log('Order status updated');
            },
            onError: (errors) => {
                console.error('Failed to update status:', errors);
                alert('Failed to update order status');
            },
        });
    };

    const getPatientName = (patient: any) => {
        return patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lab Queue" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Lab Queue</h1>
            </div>

            <div className="m-2 space-y-4">
                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search patient name or visit number..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="max-w-md"
                                />
                            </div>
                            <Select value={status} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="requested">Requested</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit" variant="outline">
                                <Search className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Patient Cards */}
                <div className="space-y-4">
                    {labQueue.data.map((patientGroup) => {
                        const patientName = getPatientName(patientGroup.patient);
                        const primaryOrder = patientGroup.orders?.[0];
                        const requestedAt = primaryOrder?.requested_at ? new Date(primaryOrder.requested_at) : null;
                        const visitDate = requestedAt ? requestedAt.toLocaleDateString() : '—';
                        const visitTime = requestedAt ? requestedAt.toLocaleTimeString() : '—';
                        const patientAllergies = Array.isArray((patientGroup.patient as any).allergies)
                            ? (patientGroup.patient as any).allergies
                            : [];
                        const resolveService = (item: any) =>
                            item.labService || item.lab_service || item.service || item.item || null;
                        const resolveSampleType = (service: any) =>
                            service?.sampleType || service?.sample_type || null;

                        return (
                            <Card key={patientGroup.patient.id}>
                                <CardHeader className="space-y-3">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{patientName}</CardTitle>
                                            <div className="text-sm text-muted-foreground">
                                                Patient ID {patientGroup.patient.id} • Visit {patientGroup.visit.visit_number}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-5">
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Patient ID</Label>
                                            <div className="font-medium">{patientGroup.patient.id}</div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Patient Name</Label>
                                            <div className="font-medium">{patientName}</div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Age</Label>
                                            <div className="font-medium">{patientGroup.patient.age ? `${patientGroup.patient.age} Year(s)` : '—'}</div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Gender</Label>
                                            <div className="font-medium">{patientGroup.patient.gender || '—'}</div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Visit Date</Label>
                                            <div className="font-medium">{visitDate}</div>
                                            <div className="text-xs text-muted-foreground">{visitTime}</div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {patientAllergies.length > 0 ? (
                                        <Alert variant="destructive" className="border-destructive/50">
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertTitle>Please be aware</AlertTitle>
                                            <AlertDescription>
                                                This client has reported allergies: {patientAllergies.map((allergy: any) => allergy.name).filter(Boolean).join(', ') || 'Reported allergies on file.'}
                                            </AlertDescription>
                                        </Alert>
                                    ) : (
                                        <div className="text-xs text-muted-foreground">No allergies recorded.</div>
                                    )}

                                    <div className="rounded-lg border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12">S/N</TableHead>
                                                    <TableHead>Service Name</TableHead>
                                                    <TableHead>Instructions</TableHead>
                                                    <TableHead>Order Date</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Priority</TableHead>
                                                    <TableHead>Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {patientGroup.all_items.map((item, index) => {
                                                    const service = resolveService(item);
                                                    const sampleType = resolveSampleType(service);
                                                    const itemOrder = patientGroup.orders.find((order) => order.id === item.visit_order_id) || primaryOrder;
                                                    const itemRequestedAt = itemOrder?.requested_at ? new Date(itemOrder.requested_at) : null;
                                                    const itemVisitDate = itemRequestedAt ? itemRequestedAt.toLocaleDateString() : visitDate;
                                                    const itemVisitTime = itemRequestedAt ? itemRequestedAt.toLocaleTimeString() : visitTime;

                                                    return (
                                                        <TableRow key={item.id}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>
                                                                <div className="font-medium">
                                                                    {service ? service.name : `No Lab Service (ID: ${item.item_id})`}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {service ? `${service.code || '—'} • UGX${service.price ?? '—'}` : `Item ID: ${item.item_id}`}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {sampleType?.name ? `Sample: ${sampleType.name}` : 'No special instructions'}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    Sample #{item.labSample?.sample_number || '—'}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm">{itemVisitDate}</div>
                                                                <div className="text-xs text-muted-foreground">{itemVisitTime}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {itemOrder && (
                                                                    <Badge className={statusColors[itemOrder.status as keyof typeof statusColors]}>
                                                                        {itemOrder.status === 'requested' && <Clock className="h-3 w-3 mr-1" />}
                                                                        {itemOrder.status === 'processing' && <TestTube className="h-3 w-3 mr-1" />}
                                                                        {itemOrder.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                                                                        {itemOrder.status === 'cancelled' && <XCircle className="h-3 w-3 mr-1" />}
                                                                        {itemOrder.status}
                                                                    </Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {itemOrder && (
                                                                    <Badge variant={itemOrder.priority === 'urgent' ? 'destructive' : 'secondary'}>
                                                                        {itemOrder.priority}
                                                                    </Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {itemOrder ? (
                                                                    <SamplePickModal
                                                                        order={{
                                                                            ...itemOrder,
                                                                            visit: {
                                                                                ...patientGroup.visit,
                                                                                patient: patientGroup.patient,
                                                                            },
                                                                            items: [item],
                                                                        }}
                                                                        item={item}
                                                                        onSuccess={() => {
                                                                            window.location.reload();
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <span className="text-xs text-muted-foreground">No order</span>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                                {patientGroup.all_items.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
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

                {/* Pagination */}
                {labQueue.links?.length > 0 && (
                    <div className="flex justify-center">
                        <div className="flex gap-1">
                            {labQueue.links.map((link, index) => (
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
