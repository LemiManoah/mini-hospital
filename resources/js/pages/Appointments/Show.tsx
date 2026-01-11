import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Appointment } from '@/types/appointment';
import { index as appointmentsIndex, edit as appointmentEdit, destroy as appointmentDestroy } from '@/routes/appointments';
import { show as patientShow } from '@/routes/patients';
import { format } from 'date-fns';
import { router } from '@inertiajs/react';

const formatDate = (dateString: string) => format(new Date(dateString), 'MMMM d, yyyy');

const breadcrumbs = (appointment: Appointment): BreadcrumbItem[] => [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Appointments', href: appointmentsIndex().url },
    { title: `#${appointment.id}`, href: '#' },
];

interface Props {
    appointment: Appointment;
}

export default function Show({ appointment }: Props) {
    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            router.delete(appointmentDestroy(appointment.id).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(appointment)}>
            <Head title={`Appointment #${appointment.id}`} />

            <div className="mt-4 mb-4 flex items-center gap-2 px-4">
                <Link href={appointmentsIndex().url} className="mr-2">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>

                <h1 className="text-2xl font-bold">Appointment #{appointment.id}</h1>

                <div className="ml-auto flex items-center gap-2">
                    <Link href={appointmentEdit(appointment.id).url}>
                        <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={handleCancel}>
                        <Trash2 className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                </div>
            </div>

            <div className="m-2 rounded border p-6 max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Appointment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</p>
                            <p className="mt-1 text-sm text-gray-900">{formatDate(appointment.appointment_date)}</p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Time</p>
                            <p className="mt-1 text-sm text-gray-900">{appointment.appointment_time}</p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</p>
                            {appointment.patient ? (
                                <Link href={patientShow(appointment.patient.id).url} className="text-sm text-blue-600 hover:underline">
                                    {appointment.patient.first_name} {appointment.patient.last_name}
                                </Link>
                            ) : (
                                <p className="mt-1 text-sm text-gray-900">-</p>
                            )}
                        </div>

                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</p>
                            <p className="mt-1 text-sm text-gray-900">{appointment.doctor?.name || '-'}</p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</p>
                            <p className="mt-1">
                                <Badge variant={appointment.status === 'scheduled' ? 'default' : appointment.status === 'completed' ? 'success' : 'destructive'}>
                                    {appointment.status.replace('_', ' ')}
                                </Badge>
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</p>
                            <p className="mt-1 text-sm text-gray-900">{appointment.notes || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
