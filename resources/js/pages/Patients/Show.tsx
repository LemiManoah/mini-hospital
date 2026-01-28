import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { format } from 'date-fns';

import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index as patientsIndex } from '@/routes/patients';
import { create as appointmentCreate } from '@/routes/appointments';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

import { Patient } from '@/types/patient';
import { Appointment } from '@/types/appointment';
import { BreadcrumbItem } from '@/types';
import StartVisitModal from '@/components/StartVisitModal';

/* -------------------------------------------------------------------------- */
/* Utils */
/* -------------------------------------------------------------------------- */

const breadcrumbs = (patient: Patient): BreadcrumbItem[] => [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Patients', href: patientsIndex().url },
    { title: `${patient.first_name} ${patient.last_name}`, href: '#' },
];

const formatDate = (date?: string) =>
    date ? format(new Date(date), 'dd MMM yyyy') : '—';

const getAge = (dob?: string) => {
    if (!dob) return '—';
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

/* -------------------------------------------------------------------------- */
/* Small reusable card */
/* -------------------------------------------------------------------------- */

const InfoCard = ({
    title,
    value,
}: {
    title: string;
    value?: React.ReactNode;
}) => (
    <div className="rounded-lg bg-gray-50 p-3">
        <p className="text-xs font-medium uppercase text-gray-500">{title}</p>
        <p className="mt-1 text-sm font-medium text-gray-900">
            {value || '—'}
        </p>
    </div>
);

/* -------------------------------------------------------------------------- */
/* Page */
/* -------------------------------------------------------------------------- */

interface Props {
    patient: Patient;
    appointments?: Appointment[];
}

export default function PatientShow({
    patient,
    appointments = [],
}: Props) {
    const fullName = `${patient.first_name} ${patient.last_name}`;

    return (
        <AppLayout breadcrumbs={breadcrumbs(patient)}>
            <Head title={fullName} />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">

                {/* ====================================================== */}
                {/* Header */}
                {/* ====================================================== */}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-xl font-semibold">
                            {fullName}
                            <Badge
                                variant={
                                    patient.is_active
                                        ? 'default'
                                        : 'destructive'
                                }
                            >
                                {patient.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </h1>
                        <p className="text-sm text-gray-500">
                            Patient No: {patient.patient_number} •{' '}
                            {getAge(patient.date_of_birth)} yrs •{' '}
                            {patient.gender}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <StartVisitModal patient={patient}>
                            <Button>Start Visit</Button>
                        </StartVisitModal>

                        <Link
                            href={appointmentCreate.url({
                                query: { patient_id: patient.id },
                            })}
                        >
                            <Button variant="outline">
                                Schedule Appointment
                            </Button>
                        </Link>

                        <Button variant="ghost">Edit Patient</Button>
                    </div>
                </div>

                {/* ====================================================== */}
                {/* Clinical Snapshot */}
                {/* ====================================================== */}

                <Card>
                    <CardHeader>
                        <CardTitle>Clinical Snapshot</CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <InfoCard
                            title="Category"
                            value={patient.patient_category?.name}
                        />
                        <InfoCard
                            title="Allergies"
                            value={
                                patient.allergies?.length
                                    ? `${patient.allergies.length} recorded`
                                    : 'None known'
                            }
                        />
                        <InfoCard
                            title="Last Visit"
                            value={
                                patient.visits?.length > 0
                                    ? formatDate(
                                          patient.visits
                                              .sort(
                                                  (a, b) =>
                                                      new Date(
                                                          b.visit_date
                                                      ).getTime() -
                                                      new Date(
                                                          a.visit_date
                                                      ).getTime()
                                              )[0].visit_date
                                      )
                                    : 'No visits'
                            }
                        />
                        <InfoCard
                            title="Registered"
                            value={formatDate(
                                patient.registration_date
                            )}
                        />
                    </CardContent>
                </Card>

                {/* ====================================================== */}
                {/* Tabs */}
                {/* ====================================================== */}

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="allergies">Allergies</TabsTrigger>
                        <TabsTrigger value="appointments">
                            Appointments
                        </TabsTrigger>
                        <TabsTrigger value="visits">Visits</TabsTrigger>
                    </TabsList>

                    {/* ================= OVERVIEW ================= */}

                    <TabsContent value="overview" className="space-y-4">

                        {/* Bio Data */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Bio Data</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-4">
                                <InfoCard title="Full Name" value={fullName} />
                                <InfoCard
                                    title="Date of Birth"
                                    value={formatDate(
                                        patient.date_of_birth
                                    )}
                                />
                                <InfoCard
                                    title="Gender"
                                    value={patient.gender}
                                />
                                <InfoCard
                                    title="Marital Status"
                                    value={patient.marital_status}
                                />
                            </CardContent>
                        </Card>

                        {/* Contact */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact & Address</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-3">
                                <InfoCard
                                    title="Phone"
                                    value={patient.phone_number}
                                />
                                <InfoCard
                                    title="Alt Phone"
                                    value={
                                        patient.alternative_phone_number
                                    }
                                />
                                <InfoCard
                                    title="Address"
                                    value={
                                        patient.address?.display_name
                                    }
                                />
                            </CardContent>
                        </Card>

                        {/* Next of Kin */}
                        {(patient.next_of_kin_name ||
                            patient.next_of_kin_number) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Next of Kin</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-3">
                                    <InfoCard
                                        title="Name"
                                        value={
                                            patient.next_of_kin_name
                                        }
                                    />
                                    <InfoCard
                                        title="Relationship"
                                        value={
                                            patient.next_of_kin_relationship
                                        }
                                    />
                                    <InfoCard
                                        title="Phone"
                                        value={
                                            patient.next_of_kin_number
                                        }
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* ================= ALLERGIES ================= */}

                    <TabsContent value="allergies">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Allergies</CardTitle>
                                <Button size="sm">+ Add Allergy</Button>
                            </CardHeader>

                            <CardContent>
                                {patient.allergies?.length ? (
                                    <div className="space-y-2">
                                        {patient.allergies.map(
                                            (allergy: any) => (
                                                <div
                                                    key={allergy.id}
                                                    className="flex items-center justify-between rounded border p-3"
                                                >
                                                    <div>
                                                        <p className="font-medium">
                                                            {allergy.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Severity:{' '}
                                                            {
                                                                allergy
                                                                    .pivot
                                                                    ?.severity
                                                            }
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            allergy
                                                                .pivot
                                                                ?.severity ===
                                                            'severe'
                                                                ? 'destructive'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {
                                                            allergy
                                                                .pivot
                                                                ?.severity
                                                        }
                                                    </Badge>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No allergies recorded.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ================= APPOINTMENTS ================= */}

                    <TabsContent value="appointments">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Appointments</CardTitle>
                                <Link
                                    href={appointmentCreate.url({
                                        query: { patient_id: patient.id },
                                    })}
                                >
                                    <Button size="sm">
                                        + Schedule
                                    </Button>
                                </Link>
                            </CardHeader>

                            <CardContent>
                                {appointments.length ? (
                                    <div className="space-y-2">
                                        {appointments.map((a) => (
                                            <div
                                                key={a.id}
                                                className="flex items-center justify-between rounded border p-3"
                                            >
                                                <div>
                                                    <p className="font-medium">
                                                        {formatDate(
                                                            a.appointment_date
                                                        )}{' '}
                                                        • {a.appointment_time}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {a.doctor?.name ??
                                                            '—'}
                                                    </p>
                                                </div>

                                                <Badge>{a.status}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No appointments.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ================= VISITS ================= */}

                    <TabsContent value="visits">
                        <Card>
                            <CardHeader>
                                <CardTitle>Visits</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">
                                    Visit timeline will appear here.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
