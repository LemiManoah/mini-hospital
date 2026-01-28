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

type DayOption = { value: number; label: string };

type WorkingHour = {
    id: number;
    doctor_id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
};

type Props = {
    workingHour: WorkingHour;
    doctors: Array<{ id: number; name: string }>;
    days: DayOption[];
};

export default function DoctorWorkingHourEdit({
    workingHour,
    doctors = [],
    days = [],
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        doctor_id: String(workingHour.doctor_id ?? ''),
        day_of_week: String(workingHour.day_of_week ?? ''),
        start_time: workingHour.start_time ?? '',
        end_time: workingHour.end_time ?? '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/doctor-working-hours/${workingHour.id}`);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Doctor Working Hours', href: '/doctor-working-hours' },
        { title: 'Edit Working Hours', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Working Hours" />

            <div className="mt-4 mb-4 flex items-center gap-2 px-4">
                <Link href="/doctor-working-hours">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Edit Working Hours</h1>
            </div>

            <div className="m-2 rounded border p-6 max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        <div className="space-y-2">
                            <Label>Day *</Label>
                            <Select
                                value={data.day_of_week}
                                onValueChange={(value) => setData('day_of_week', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                                <SelectContent>
                                    {days.map((day) => (
                                        <SelectItem
                                            key={day.value}
                                            value={String(day.value)}
                                        >
                                            {day.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.day_of_week && (
                                <p className="text-sm text-red-500">{errors.day_of_week}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="start_time">Start Time *</Label>
                            <Input
                                type="time"
                                id="start_time"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                                required
                            />
                            {errors.start_time && (
                                <p className="text-sm text-red-500">{errors.start_time}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end_time">End Time *</Label>
                            <Input
                                type="time"
                                id="end_time"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                                required
                            />
                            {errors.end_time && (
                                <p className="text-sm text-red-500">{errors.end_time}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Link href="/doctor-working-hours">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Working Hours'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
