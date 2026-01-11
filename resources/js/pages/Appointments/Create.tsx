import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';
import { index as indexRoute } from '@/routes/appointments';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Appointments', href: indexRoute().url },
    { title: 'Schedule Appointment', href: '#' },
];

type Option = {
    value: string;
    label: string;
};

type Props = {
    patients: Array<{ id: number; name: string }>;
    doctors: Array<{ id: number; name: string }>;
    statuses: Option[];
};

export default function AppointmentCreate({
    patients = [],
    doctors = [],
    statuses = [],
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        status: 'scheduled',
        notes: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/appointments');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedule Appointment" />

            {/* Header */}
            <div className="mt-4 mb-4 flex items-center gap-2 px-4">
                <Link href={indexRoute().url}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Schedule Appointment</h1>
            </div>

            <div className="m-2 rounded border p-6 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Appointment Details */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Appointment Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Patient */}
                            <div className="space-y-2">
                                <Label>Patient *</Label>
                                <Select
                                    value={data.patient_id}
                                    onValueChange={(value) => setData('patient_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select patient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {patients.map((patient) => (
                                            <SelectItem
                                                key={patient.id}
                                                value={String(patient.id)}
                                            >
                                                {patient.name} 
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.patient_id && (
                                    <p className="text-sm text-red-500">{errors.patient_id}</p>
                                )}
                            </div>

                            {/* Doctor */}
                            <div className="space-y-2">
                                <Label>Doctor *</Label>
                                <Select
                                    value={data.doctor_id}
                                    onValueChange={(value) => setData('doctor_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select doctor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {doctors.map((doctor) => (
                                            <SelectItem
                                                key={doctor.id}
                                                value={String(doctor.id)}
                                            >
                                                {doctor.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.doctor_id && (
                                    <p className="text-sm text-red-500">{errors.doctor_id}</p>
                                )}
                            </div>

                            {/* Date */}
                            <div className="space-y-2">
                                <Label htmlFor="appointment_date">Date *</Label>
                                <Input
                                    type="date"
                                    id="appointment_date"
                                    value={data.appointment_date}
                                    onChange={(e) =>
                                        setData('appointment_date', e.target.value)
                                    }
                                    required
                                />
                                {errors.appointment_date && (
                                    <p className="text-sm text-red-500">
                                        {errors.appointment_date}
                                    </p>
                                )}
                            </div>

                            {/* Time */}
                            <div className="space-y-2">
                                <Label htmlFor="appointment_time">Time *</Label>
                                <Input
                                    type="time"
                                    id="appointment_time"
                                    value={data.appointment_time}
                                    onChange={(e) =>
                                        setData('appointment_time', e.target.value)
                                    }
                                    required
                                />
                                {errors.appointment_time && (
                                    <p className="text-sm text-red-500">
                                        {errors.appointment_time}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((status) => (
                                            <SelectItem
                                                key={status.value}
                                                value={status.value}
                                            >
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <textarea
                            className="w-full rounded border px-3 py-2 text-sm"
                            rows={3}
                            placeholder="Optional notes for the appointment"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-4">
                        <Link href={indexRoute().url}>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Scheduling...' : 'Schedule Appointment'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
