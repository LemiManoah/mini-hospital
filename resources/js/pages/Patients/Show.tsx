import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Printer, FileText, Mail, Phone } from 'lucide-react';
import { route } from '@/utils/route';

type Patient = {
    id: number;
    patient_number: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    marital_status: string;
    is_pediatric: boolean;
    age_years: number | null;
    age_months: number | null;
    preferred_language: string | null;
    religion: string | null;
    registration_date: string;
    is_active: boolean;
    patient_category: {
        id: number;
        name: string;
    } | null;
    next_of_kin_name: string | null;
    next_of_kin_number: string | null;
    next_of_kin_relationship: string | null;
    phone_number: string;
    alternative_phone_number: string | null;
    phone_owner: boolean;
    address: {
        id: number;
        district: string;
        city: string;
        county: string;
    } | null;
};

const breadcrumbs = (patient: Patient): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Patients',
        href: route('patients.index'),
    },
    {
        title: `${patient.first_name} ${patient.last_name}`,
        href: '#',
    },
];

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export default function PatientShow({ patient }: { patient: Patient }) {
    const fullName = `${patient.first_name} ${patient.last_name}`;
    const ageDisplay = patient.age_years 
        ? `${patient.age_years} years${patient.age_months ? `, ${patient.age_months} months` : ''}`
        : 'N/A';

    return (
        <AppLayout breadcrumbs={breadcrumbs(patient)}>
            <Head title={fullName} />
            
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href={route('patients.index')} className="mr-2">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{fullName}</h1>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${patient.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {patient.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                    </Button>
                    <Link href={route('patients.edit', {id: patient.id})}>
                        <Button size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 m-2">
                {/* Patient Summary Card */}
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Patient Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Patient ID</p>
                                    <p className="font-medium">{patient.patient_number}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <FileText className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Category</p>
                                    <p className="font-medium">{patient.patient_category?.name || 'N/A'}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <FileText className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Age</p>
                                    <p className="font-medium">{ageDisplay}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <div className="bg-yellow-100 p-3 rounded-full">
                                    <FileText className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Gender</p>
                                    <p className="font-medium capitalize">{patient.gender}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <div className="bg-red-100 p-3 rounded-full">
                                    <FileText className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Marital Status</p>
                                    <p className="font-medium capitalize">{patient.marital_status || 'N/A'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Card */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="bg-blue-100 p-3 rounded-full mt-1">
                                    <Phone className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="font-medium">{patient.phone_number}</p>
                                    {!patient.phone_owner && (
                                        <p className="text-xs text-gray-500">
                                            Belongs to: {patient.next_of_kin_relationship || 'Other'}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            {patient.alternative_phone_number && (
                                <div className="flex items-center space-x-4">
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <Phone className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Alternative Phone</p>
                                        <p className="font-medium">{patient.alternative_phone_number}</p>
                                    </div>
                                </div>
                            )}
                            
                            {patient.address && (
                                <div className="flex items-start space-x-4">
                                    <div className="bg-green-100 p-3 rounded-full mt-1">
                                        <FileText className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Address</p>
                                        <p className="font-medium">{patient.address.district}</p>
                                        <p className="text-sm">
                                            {[patient.address.city, patient.address.county]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Next of Kin */}
                    {(patient.next_of_kin_name || patient.next_of_kin_number) && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Next of Kin</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {patient.next_of_kin_name && (
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Name</p>
                                            <p className="font-medium">{patient.next_of_kin_name}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {patient.next_of_kin_number && (
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-purple-100 p-3 rounded-full">
                                            <Phone className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{patient.next_of_kin_number}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {patient.next_of_kin_relationship && (
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-green-100 p-3 rounded-full">
                                            <FileText className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Relationship</p>
                                            <p className="font-medium capitalize">{patient.next_of_kin_relationship}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Medical History Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Medical History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500 text-sm">No medical history recorded yet.</p>
                            <Button variant="outline" size="sm" className="mt-4">
                                Add Medical Record
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Appointments Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Appointments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500 text-sm">No upcoming appointments.</p>
                            <Button variant="outline" size="sm" className="mt-4">
                                Schedule Appointment
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Notes Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <span className="text-gray-500 text-sm">JD</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium">John Doe</p>
                                            <p className="text-xs text-gray-500">2 hours ago</p>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Patient called to confirm next week's appointment. No issues reported.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="border-t pt-4">
                                    <textarea 
                                        className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Add a note..."
                                    ></textarea>
                                    <div className="flex justify-end mt-2">
                                        <Button size="sm">Add Note</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
