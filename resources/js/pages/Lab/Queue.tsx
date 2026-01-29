import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Eye, Play, CheckCircle, XCircle, Clock, User, Calendar } from 'lucide-react';
import { useState } from 'react';

interface LabOrder {
    id: number;
    visit_id: number;
    order_type: string;
    status: string;
    created_at: string;
    visit: {
        id: number;
        visit_number: string;
        patient: {
            id: number;
            name: string;
            first_name: string;
            last_name: string;
            age?: number;
            gender?: string;
        };
        assigned_clinic?: {
            name: string;
        };
    };
    items: Array<{
        id: number;
        service_id: number;
        qty: number;
        price: number;
        service: {
            id: number;
            name: string;
            code: string;
            price: number;
            labServiceCategory?: {
                name: string;
            };
        };
        labSample?: {
            id: number;
            sample_number: string;
            status: string;
            sample_type?: {
                name: string;
            };
        };
    }>;
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

const statusIcons = {
    requested: Clock,
    processing: Play,
    completed: CheckCircle,
    cancelled: XCircle,
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

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lab Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">#</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Visit</TableHead>
                                    <TableHead>Tests</TableHead>
                                    <TableHead>Sample Status</TableHead>
                                    <TableHead>Order Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {labQueue.data?.map((order, index) => {
                                    const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
                                    return (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-medium">{getPatientName(order.visit.patient)}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.visit.patient.age}y • {order.visit.patient.gender}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-medium">{order.visit.visit_number}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.visit.assigned_clinic?.name}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {order.items.map((item) => (
                                                        <div key={item.id} className="text-sm">
                                                            <div className="font-medium">{item.service.name}</div>
                                                            <div className="text-gray-500">
                                                                {item.service.code} • UGX{item.service.price}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {order.items.map((item) => (
                                                        <Badge key={item.id} variant="outline" className="text-xs">
                                                            {item.labSample?.sample_number || 'No Sample'}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                    <div className="text-gray-500">
                                                        {new Date(order.created_at).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    <Link href={`/consultations/create?visit_id=${order.visit.id}`}>
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    {order.status === 'requested' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => updateOrderStatus(order.id, 'processing')}
                                                        >
                                                            <Play className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {order.status === 'processing' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => updateOrderStatus(order.id, 'completed')}
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {labQueue.links?.length > 0 && (
                            <div className="mt-4 flex justify-center">
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
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
