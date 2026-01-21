import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { StaffProfile } from '@/types/staff-profile';
import { CalendarDays, Phone, Mail, MapPin, User, Building } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Staff Profiles',
        href: '/staff-profile',
    },
    {
        title: 'Staff Profile Details',
        href: '#',
    },
];

interface ShowStaffProfileProps {
    staffProfile: StaffProfile;
    appointments?: Array<{
        id: number;
        appointment_date: string;
        appointment_time: string;
        status: string;
        patient?: {
            first_name: string;
            last_name: string;
        };
        doctor?: {
            name: string;
        };
    }>;
    kinRelationships: Array<{ value: string; label: string }>;
    genders: Array<{ value: string; label: string }>;
    maritalStatuses: Array<{ value: string; label: string }>;
    religions: Array<{ value: string; label: string }>;
}

export default function StaffProfileShow({ 
    staffProfile, 
    appointments,
    kinRelationships,
    genders,
    maritalStatuses,
    religions
}: ShowStaffProfileProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${staffProfile.first_name} ${staffProfile.last_name}`} />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Staff Profile Details</h1>
                <div className="space-x-2">
                    <Link href={`/staff-profile/${staffProfile.id}/edit`}>
                        <Button size="sm" variant="outline">
                            Edit
                        </Button>
                    </Link>
                    <Link href="/staff-profile">
                        <Button size="sm" variant="outline">
                            Back to List
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="m-2 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Full Name</label>
                            <p className="text-lg font-semibold">
                                {staffProfile.first_name} {staffProfile.last_name}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Staff Number</label>
                            <p className="text-lg font-semibold">{staffProfile.staff_number}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Gender</label>
                            <p className="text-lg font-semibold capitalize">{staffProfile.gender}</p>
                        </div>
                        {staffProfile.email && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-lg font-semibold">{staffProfile.email}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="w-5 h-5" />
                            Contact Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Primary Phone</label>
                            <p className="text-lg font-semibold">{staffProfile.phone_number}</p>
                        </div>
                        {staffProfile.alternative_phone_number && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Alternative Phone</label>
                                <p className="text-lg font-semibold">{staffProfile.alternative_phone_number}</p>
                            </div>
                        )}
                        {staffProfile.email && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-lg font-semibold">{staffProfile.email}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Work Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            Work Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {staffProfile.clinic && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Clinic</label>
                                <p className="text-lg font-semibold">{staffProfile.clinic.name}</p>
                                <p className="text-sm text-gray-500">Status: {staffProfile.clinic.status}</p>
                            </div>
                        )}
                        {staffProfile.address && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Address</label>
                                <p className="text-lg font-semibold">{staffProfile.address.display_name}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Appointments Section */}
            {appointments && appointments.length > 0 && (
                <div className="m-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarDays className="w-5 h-5" />
                                Upcoming Appointments ({appointments.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {appointments.map((appointment) => (
                                    <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="font-semibold">
                                                {appointment.appointment_date} at {appointment.appointment_time}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Patient: {appointment.patient?.first_name} {appointment.patient?.last_name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Doctor: {appointment.doctor?.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </AppLayout>
    );
}
