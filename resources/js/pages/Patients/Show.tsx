import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index as patientsIndex } from '@/routes/patients';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Patient } from '@/types/patient';
import { format } from 'date-fns';

const breadcrumbs = (patient: Patient): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Patients',
        href: patientsIndex().url,
    },
    {
        title: `${patient.first_name} ${patient.last_name}`,
        href: '#',
    },
];

const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
};

const getAge = (dateString: string) => {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

interface InfoCardProps {
    title: string;
    value: React.ReactNode;
    className?: string;
}

const InfoCard = ({ title, value, className = '' }: InfoCardProps) => (
    <div className={`p-3 bg-gray-50 rounded-lg ${className}`}>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="mt-1 text-sm text-gray-900">{value || 'N/A'}</p>
    </div>
);

interface ShowProps {
    patient: Patient;
}

export default function Show({ patient }: ShowProps) {
    const fullName = `${patient.first_name} ${patient.last_name}`;
    const age = patient.date_of_birth ? getAge(patient.date_of_birth) : 'N/A';

    return (
        <AppLayout breadcrumbs={breadcrumbs(patient)}>
            <Head title={fullName} />

            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={patientsIndex().url} className="text-sm text-gray-500 hover:text-gray-700">
                            ← Back
                        </Link>
                        <h1 className="text-xl font-semibold">{fullName}</h1>
                        <Badge variant={patient.is_active ? 'default' : 'destructive'}>
                            {patient.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>

                    <Link href={`/patients/${patient.id}/edit`}>
                        <Button size="sm" variant="outline">
                            Edit Patient
                        </Button>
                    </Link>
                </div>

                {/* ================= BIO DATA ================= */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bio Data</CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <InfoCard title="Full Name" value={fullName} />
                        <InfoCard title="Age" value={`${age} years`} />
                        <InfoCard title="Gender" value={patient.gender} />
                        <InfoCard title="Date of Birth" value={formatDate(patient.date_of_birth)} />

                        <InfoCard title="Patient Category" value={patient.patient_category?.name} />
                        <InfoCard title="Marital Status" value={patient.marital_status} />
                        <InfoCard title="Religion" value={patient.religion} />
                        <InfoCard title="Registration Date" value={formatDate(patient.registration_date)} />

                        <InfoCard title="Phone Number" value={patient.phone_number} />
                        <InfoCard title="Alternative Phone" value={patient.alternative_phone_number} />
                        <InfoCard title="Phone Owner" value={patient.phone_owner ? 'Patient' : 'Next of Kin'} />

                        <InfoCard
                            title="Address"
                            value={
                                patient.address
                                    ? patient.address.display_name
                                    : 'N/A'
                            }
                            className="lg:col-span-2"
                        />
                    </CardContent>
                </Card>

                {/* ================= NEXT OF KIN ================= */}
                {(patient.next_of_kin_name || patient.next_of_kin_number) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Next of Kin</CardTitle>
                        </CardHeader>

                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InfoCard title="Name" value={patient.next_of_kin_name} />
                            <InfoCard title="Relationship" value={patient.next_of_kin_relationship} />
                            <InfoCard title="Phone" value={patient.next_of_kin_number} />
                        </CardContent>
                    </Card>
                )}

                {/* ================= MEDICAL RECORDS ================= */}
                <Card>
                    <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                        <h3 className="font-medium">Medical Records</h3>
                        <Button size="sm" variant="outline">+ Add Record</Button>
                    </div>

                    <CardContent className="p-6 text-center text-gray-500">
                        No medical records found.
                    </CardContent>
                </Card>

                {/* ================= APPOINTMENTS ================= */}
                <Card>
                    <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                        <h3 className="font-medium">Appointments</h3>
                        <Button size="sm" variant="outline">+ Schedule</Button>
                    </div>

                    <CardContent className="p-6 text-center text-gray-500">
                        No upcoming appointments.
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
