import { Button } from '@/components/ui/button';
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
import { useState } from 'react';

type DayOption = { value: number; label: string };

type WorkingHour = {
    id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
};

type DoctorRow = {
    id: number;
    name: string;
    working_hours: WorkingHour[];
};

type PaginatedDoctors = {
    data: DoctorRow[];
    links?: Array<{ url: string | null; label: string; active: boolean }>;
};

type Props = {
    workingHours: PaginatedDoctors;
    doctors: Array<{ id: number; name: string }>;
    filters: { doctor_id?: string };
    days: DayOption[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Doctor Working Hours', href: '/doctor-working-hours' },
];

export default function DoctorWorkingHourIndex({
    workingHours,
    doctors = [],
    filters,
    days = [],
}: Props) {
    const [doctorId, setDoctorId] = useState(filters?.doctor_id || '');
    const handleFilter = (value: string) => {
        setDoctorId(value);
        router.get(
            '/doctor-working-hours',
            { doctor_id: value || undefined },
            { preserveState: true, replace: true }
        );
    };

    const rows: DoctorRow[] = workingHours.data || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Doctor Working Hours" />

            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Doctor Working Hours</h1>
                <Link href="/doctor-working-hours/create">
                    <Button>+ Add Working Hours</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <div className="mb-4 rounded-md bg-gray-50 p-4 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500">Doctor</label>
                            <select
                                className="w-full rounded border px-2 py-1"
                                value={doctorId}
                                onChange={(e) => handleFilter(e.target.value)}
                            >
                                <option value="">All doctors</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor.id} value={String(doctor.id)}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <Table className="min-w-[1100px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Doctor</TableHead>
                            {days.map((day) => (
                                <TableHead key={day.value}>{day.label}</TableHead>
                            ))}
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((doctor) => {
                                const hoursByDay = doctor.working_hours.reduce<
                                    Record<number, WorkingHour>
                                >((acc, hour) => {
                                    acc[hour.day_of_week] = hour;
                                    return acc;
                                }, {});

                                return (
                                    <TableRow key={doctor.id}>
                                        <TableCell>{doctor.id}</TableCell>
                                        <TableCell>{doctor.name}</TableCell>
                                        {days.map((day) => {
                                            const hour = hoursByDay[day.value];
                                            if (!hour) {
                                                return (
                                                    <TableCell key={day.value} className="text-gray-400">
                                                        —
                                                    </TableCell>
                                                );
                                            }
                                            return (
                                                <TableCell key={day.value}>
                                                    <Link
                                                        href={`/doctor-working-hours/${hour.id}/edit`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {hour.start_time} - {hour.end_time}
                                                    </Link>
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell className="text-right">
                                            <Link href={`/doctor-working-hours?doctor_id=${doctor.id}`}>
                                                <Button size="sm" variant="outline">
                                                    Manage
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={days.length + 3} className="py-4 text-center">
                                    No working hours found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {workingHours.links && (
                    <div className="mt-4 flex justify-end">
                        <div className="flex items-center gap-2">
                            {workingHours.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => router.get(link.url || '#')}
                                    className={`px-3 py-1 rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-100'} ${!link.url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
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
