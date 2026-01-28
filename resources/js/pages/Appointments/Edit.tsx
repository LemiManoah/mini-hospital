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
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { FormEvent } from 'react';
import { index as indexRoute, update, destroy } from '@/routes/appointments';

type Option = {
    value: string;
    label: string;
};

type Props = {
    appointment: {
        id: number;
        patient_id: number;
        doctor_id: number;
        appointment_date: string;
        appointment_time: string;
        status: string;
        appointment_method_id?: number | null;
        appointment_category_id?: number | null;
        duration_minutes?: number;
        clinic_id?: number | null;
        service_id?: number | null;
        priority_flag?: string;
        virtual_link?: string | null;
        platform?: string | null;
        notes?: string;
    };
    patients: Array<{ id: number; name: string }>;
    doctors: Array<{ id: number; name: string }>;
    statuses: Option[];
    methods: Array<{ id: number; name: string }>;
    categories: Array<{ id: number; name: string }>;
    clinics: Array<{ id: number; name: string }>;
    services: Array<{ id: number; name: string }>;
    priorities: Option[];
};

export default function AppointmentEdit({
    appointment,
    patients = [],
    doctors = [],
    statuses = [],
    methods = [],
    categories = [],
    clinics = [],
    services = [],
    priorities = [],
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        patient_id: String(appointment.patient_id ?? ''),
        doctor_id: String(appointment.doctor_id ?? ''),
        appointment_date: appointment.appointment_date ?? '',
        appointment_time: appointment.appointment_time ?? '',
        status: appointment.status ?? 'scheduled',
        appointment_method_id: appointment.appointment_method_id ? String(appointment.appointment_method_id) : '',
        appointment_category_id: appointment.appointment_category_id ? String(appointment.appointment_category_id) : '',
        duration_minutes: String(appointment.duration_minutes ?? 30),
        clinic_id: appointment.clinic_id ? String(appointment.clinic_id) : '',
        service_id: appointment.service_id ? String(appointment.service_id) : '',
        priority_flag: appointment.priority_flag ?? 'medium',
        virtual_link: appointment.virtual_link ?? '',
        platform: appointment.platform ?? '',
        notes: appointment.notes ?? '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(update.url({ appointment: appointment.id }));
    };

    const handleCancelAppointment = () => {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            router.delete(destroy(appointment.id).url);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Appointments', href: indexRoute().url },
        { title: `Edit Appointment #${appointment.id}`, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Appointment #${appointment.id}`} />

            <div className="mt-4 mb-4 flex items-center gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href={indexRoute().url} className="mr-2">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Appointment</h1>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="destructive" onClick={handleCancelAppointment}>
                        <Trash2 className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                </div>
            </div>

            <div className="m-2 rounded border p-6 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Appointment Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Patient */}
                            <div className="space-y-2">
                                <Label>Patient *</Label>
                                <Select value={data.patient_id} onValueChange={(value) => setData('patient_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select patient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {patients.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.patient_id && <p className="text-sm text-red-500">{errors.patient_id}</p>}
                            </div>

                            {/* Doctor */}
                            <div className="space-y-2">
                                <Label>Doctor *</Label>
                                <Select value={data.doctor_id} onValueChange={(value) => setData('doctor_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select doctor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {doctors.map((d) => (
                                            <SelectItem key={d.id} value={String(d.id)}>
                                                {d.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.doctor_id && <p className="text-sm text-red-500">{errors.doctor_id}</p>}
                            </div>

                            {/* Date */}
                            <div className="space-y-2">
                                <Label htmlFor="appointment_date">Date *</Label>
                                <Input
                                    type="date"
                                    id="appointment_date"
                                    value={data.appointment_date}
                                    onChange={(e) => setData('appointment_date', e.target.value)}
                                    required
                                />
                                {errors.appointment_date && <p className="text-sm text-red-500">{errors.appointment_date}</p>}
                            </div>

                            {/* Time */}
                            <div className="space-y-2">
                                <Label htmlFor="appointment_time">Time *</Label>
                                <Input
                                    type="time"
                                    id="appointment_time"
                                    value={data.appointment_time}
                                    onChange={(e) => setData('appointment_time', e.target.value)}
                                    required
                                />
                                {errors.appointment_time && <p className="text-sm text-red-500">{errors.appointment_time}</p>}
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Method */}
                            <div className="space-y-2">
                                <Label>Method</Label>
                                <Select
                                    value={data.appointment_method_id}
                                    onValueChange={(value) => setData('appointment_method_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {methods.map((method) => (
                                            <SelectItem key={method.id} value={String(method.id)}>
                                                {method.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.appointment_method_id && <p className="text-sm text-red-500">{errors.appointment_method_id}</p>}
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                    value={data.appointment_category_id}
                                    onValueChange={(value) => setData('appointment_category_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={String(category.id)}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.appointment_category_id && <p className="text-sm text-red-500">{errors.appointment_category_id}</p>}
                            </div>

                            {/* Duration */}
                            <div className="space-y-2">
                                <Label htmlFor="duration_minutes">Duration (minutes) *</Label>
                                <Input
                                    type="number"
                                    id="duration_minutes"
                                    min={5}
                                    max={480}
                                    value={data.duration_minutes}
                                    onChange={(e) => setData('duration_minutes', e.target.value)}
                                    required
                                />
                                {errors.duration_minutes && <p className="text-sm text-red-500">{errors.duration_minutes}</p>}
                            </div>

                            {/* Priority */}
                            <div className="space-y-2">
                                <Label>Priority *</Label>
                                <Select value={data.priority_flag} onValueChange={(value) => setData('priority_flag', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {priorities.map((priority) => (
                                            <SelectItem key={priority.value} value={priority.value}>
                                                {priority.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.priority_flag && <p className="text-sm text-red-500">{errors.priority_flag}</p>}
                            </div>

                            {/* Clinic */}
                            <div className="space-y-2">
                                <Label>Clinic</Label>
                                <Select value={data.clinic_id} onValueChange={(value) => setData('clinic_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select clinic" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clinics.map((clinic) => (
                                            <SelectItem key={clinic.id} value={String(clinic.id)}>
                                                {clinic.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.clinic_id && <p className="text-sm text-red-500">{errors.clinic_id}</p>}
                            </div>

                            {/* Service */}
                            <div className="space-y-2">
                                <Label>Service</Label>
                                <Select value={data.service_id} onValueChange={(value) => setData('service_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {services.map((service) => (
                                            <SelectItem key={service.id} value={String(service.id)}>
                                                {service.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.service_id && <p className="text-sm text-red-500">{errors.service_id}</p>}
                            </div>

                            {/* Platform */}
                            <div className="space-y-2">
                                <Label htmlFor="platform">Platform</Label>
                                <Input
                                    id="platform"
                                    value={data.platform}
                                    onChange={(e) => setData('platform', e.target.value)}
                                    placeholder="e.g. Zoom, WhatsApp, Phone"
                                />
                                {errors.platform && <p className="text-sm text-red-500">{errors.platform}</p>}
                            </div>

                            {/* Virtual link */}
                            <div className="space-y-2">
                                <Label htmlFor="virtual_link">Virtual Link</Label>
                                <Input
                                    id="virtual_link"
                                    value={data.virtual_link}
                                    onChange={(e) => setData('virtual_link', e.target.value)}
                                    placeholder="https://..."
                                />
                                {errors.virtual_link && <p className="text-sm text-red-500">{errors.virtual_link}</p>}
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
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
