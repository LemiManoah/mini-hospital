import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Edit, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';

import {
    index,
    create,
    edit,
    destroy,
    show,
} from '@/routes/appointments';

import { Appointment, PaginatedAppointments } from '@/types/appointment';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Appointments',
        href: '#',
    },
];

export default function AppointmentIndex({
    appointments,
    filters,
}: {
    appointments: PaginatedAppointments;
    filters: { search?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            index.url({ query: { search } }),
            {},
            { preserveState: true, replace: true }
        );
    };

    const handleClear = () => {
        setSearch('');
        router.get(index.url({ query: {} }), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            router.delete(destroy(id).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appointments" />

            {/* Header */}
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Appointments</h1>
                <Link href={create().url}>
                    <Button>+ Schedule Appointment</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                {/* Search */}
                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <Input
                        placeholder="Search by patient or doctor..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                    <div className="flex gap-2">
                        <Button type="submit" variant="outline">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                        {search && (
                            <Button type="button" variant="ghost" onClick={handleClear}>
                                Clear
                            </Button>
                        )}
                    </div>
                </form>

                {/* Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {appointments.data.length > 0 ? (
                                appointments.data.map((appointment: Appointment) => (
                                    <TableRow key={appointment.id}>
                                        <TableCell>
                                            {new Date(appointment.appointment_date).toLocaleDateString()}
                                        </TableCell>

                                        <TableCell>
                                            {appointment.appointment_time}
                                        </TableCell>

                                        <TableCell>
                                            {appointment.patient
                                                ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
                                                : '-'}
                                        </TableCell>

                                        <TableCell>
                                            {appointment.doctor?.name || '-'}
                                        </TableCell>

                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full capitalize
                                                    ${
                                                        appointment.status === 'scheduled'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : appointment.status === 'completed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }
                                                `}
                                            >
                                                {appointment.status.replace('_', ' ')}
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-right space-x-2">
                                            <Link href={show(appointment.id).url}>
                                                <Button variant="ghost" size="icon">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>

                                            <Link href={edit(appointment.id).url}>
                                                <Button variant="ghost" size="icon">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => handleDelete(appointment.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4">
                                        No appointments found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {appointments.links && (
                    <div className="mt-4 flex justify-end">
                        <div className="flex items-center gap-2">
                            {appointments.links.map((link, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`px-3 py-1 rounded
                                        ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-100'}
                                        ${!link.url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}
                                    `}
                                    disabled={!link.url}
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
