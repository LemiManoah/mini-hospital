import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { route } from '@/utils/route';

type PatientCategory = {
    id: number;
    name: string;
};

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
    country_id: number | null;
    address_id: number | null;
    registration_date: string;
    is_active: boolean;
    patient_category_id: string;
    next_of_kin_name: string | null;
    next_of_kin_number: string | null;
    next_of_kin_relationship: string | null;
    phone_number: string;
    alternative_phone_number: string | null;
    phone_owner: boolean;
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
        title: 'Edit Patient',
        href: '#',
    },
];

export default function PatientEdit({ 
    patient, 
    patientCategories = [] 
}: { 
    patient: Patient; 
    patientCategories?: PatientCategory[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        patient_number: patient.patient_number,
        first_name: patient.first_name,
        last_name: patient.last_name,
        date_of_birth: patient.date_of_birth,
        gender: patient.gender,
        marital_status: patient.marital_status,
        is_pediatric: patient.is_pediatric,
        age_years: patient.age_years,
        age_months: patient.age_months,
        preferred_language: patient.preferred_language || '',
        religion: patient.religion || '',
        country_id: patient.country_id,
        address_id: patient.address_id,
        registration_date: patient.registration_date,
        is_active: patient.is_active,
        patient_category_id: patient.patient_category_id,
        next_of_kin_name: patient.next_of_kin_name || '',
        next_of_kin_number: patient.next_of_kin_number || '',
        next_of_kin_relationship: patient.next_of_kin_relationship || '',
        phone_number: patient.phone_number,
        alternative_phone_number: patient.alternative_phone_number || '',
        phone_owner: patient.phone_owner,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('patients.update', {id: patient.id}));
    };

    // Update age when date of birth changes
    useEffect(() => {
        if (data.date_of_birth) {
            const birthDate = new Date(data.date_of_birth);
            const today = new Date();
            
            let ageYears = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                ageYears--;
            }
            
            const birthDateThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
            let ageMonths = today.getMonth() - birthDate.getMonth();
            
            if (today < birthDateThisYear) {
                ageMonths = 12 - birthDate.getMonth() + today.getMonth();
            }
            
            if (ageMonths < 0) ageMonths += 12;
            
            setData({
                ...data,
                age_years: ageYears,
                age_months: ageMonths,
                is_pediatric: ageYears < 18,
            });
        }
    }, [data.date_of_birth]);

    return (
        <AppLayout breadcrumbs={breadcrumbs(patient)}>
            <Head title={`Edit ${patient.first_name} ${patient.last_name}`} />
            
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href={route('patients.show', {id: patient.id})} className="mr-2">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">
                        Edit {patient.first_name} {patient.last_name}
                    </h1>
                </div>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4 col-span-3">
                            <h2 className="text-lg font-semibold">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="patient_number">Patient Number</Label>
                                    <Input
                                        id="patient_number"
                                        value={data.patient_number}
                                        onChange={(e) => setData('patient_number', e.target.value)}
                                        disabled
                                    />
                                    {errors.patient_number && <p className="text-sm text-red-500">{errors.patient_number}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="first_name">First Name *</Label>
                                    <Input
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        placeholder="Enter first name"
                                        required
                                    />
                                    {errors.first_name && <p className="text-sm text-red-500">{errors.first_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last Name *</Label>
                                    <Input
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        placeholder="Enter last name"
                                        required
                                    />
                                    {errors.last_name && <p className="text-sm text-red-500">{errors.last_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date_of_birth">Date of Birth *</Label>
                                    <Input
                                        id="date_of_birth"
                                        type="date"
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                        required
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                    {errors.date_of_birth && <p className="text-sm text-red-500">{errors.date_of_birth}</p>}
                                    {data.age_years !== null && (
                                        <p className="text-xs text-gray-500">
                                            Age: {data.age_years} years{data.age_months ? `, ${data.age_months} months` : ''}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender *</Label>
                                    <Select
                                        value={data.gender}
                                        onValueChange={(value) => setData('gender', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="marital_status">Marital Status</Label>
                                    <Select
                                        value={data.marital_status}
                                        onValueChange={(value) => setData('marital_status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="single">Single</SelectItem>
                                            <SelectItem value="married">Married</SelectItem>
                                            <SelectItem value="divorced">Divorced</SelectItem>
                                            <SelectItem value="widowed">Widowed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.marital_status && <p className="text-sm text-red-500">{errors.marital_status}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="patient_category_id">Patient Category *</Label>
                                    <Select
                                        value={data.patient_category_id}
                                        onValueChange={(value) => setData('patient_category_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {patientCategories.map((category) => (
                                                <SelectItem key={category.id} value={String(category.id)}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.patient_category_id && <p className="text-sm text-red-500">{errors.patient_category_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="registration_date">Registration Date *</Label>
                                    <Input
                                        id="registration_date"
                                        type="date"
                                        value={data.registration_date}
                                        onChange={(e) => setData('registration_date', e.target.value)}
                                        required
                                    />
                                    {errors.registration_date && <p className="text-sm text-red-500">{errors.registration_date}</p>}
                                </div>

                                <div className="flex items-center space-x-2 pt-5">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', Boolean(checked))}
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>

                                <div className="flex items-center space-x-2 pt-5">
                                    <Checkbox
                                        id="is_pediatric"
                                        checked={data.is_pediatric}
                                        onCheckedChange={(checked) => setData('is_pediatric', Boolean(checked))}
                                    />
                                    <Label htmlFor="is_pediatric">Pediatric Patient</Label>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4 col-span-3">
                            <h2 className="text-lg font-semibold">Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone_number">Phone Number *</Label>
                                    <Input
                                        id="phone_number"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        placeholder="Enter phone number"
                                        required
                                    />
                                    {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="alternative_phone_number">Alternative Phone</Label>
                                    <Input
                                        id="alternative_phone_number"
                                        value={data.alternative_phone_number || ''}
                                        onChange={(e) => setData('alternative_phone_number', e.target.value)}
                                        placeholder="Enter alternative phone"
                                    />
                                    {errors.alternative_phone_number && <p className="text-sm text-red-500">{errors.alternative_phone_number}</p>}
                                </div>

                                <div className="flex items-center space-x-2 pt-5">
                                    <Checkbox
                                        id="phone_owner"
                                        checked={data.phone_owner}
                                        onCheckedChange={(checked) => setData('phone_owner', Boolean(checked))}
                                    />
                                    <Label htmlFor="phone_owner">Phone belongs to patient</Label>
                                </div>
                            </div>
                        </div>

                        {/* Next of Kin */}
                        <div className="space-y-4 col-span-3">
                            <h2 className="text-lg font-semibold">Next of Kin</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="next_of_kin_name">Name</Label>
                                    <Input
                                        id="next_of_kin_name"
                                        value={data.next_of_kin_name || ''}
                                        onChange={(e) => setData('next_of_kin_name', e.target.value)}
                                        placeholder="Enter name"
                                    />
                                    {errors.next_of_kin_name && <p className="text-sm text-red-500">{errors.next_of_kin_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="next_of_kin_number">Phone Number</Label>
                                    <Input
                                        id="next_of_kin_number"
                                        value={data.next_of_kin_number || ''}
                                        onChange={(e) => setData('next_of_kin_number', e.target.value)}
                                        placeholder="Enter phone number"
                                    />
                                    {errors.next_of_kin_number && <p className="text-sm text-red-500">{errors.next_of_kin_number}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="next_of_kin_relationship">Relationship</Label>
                                    <Input
                                        id="next_of_kin_relationship"
                                        value={data.next_of_kin_relationship || ''}
                                        onChange={(e) => setData('next_of_kin_relationship', e.target.value)}
                                        placeholder="E.g., Spouse, Parent, etc."
                                    />
                                    {errors.next_of_kin_relationship && <p className="text-sm text-red-500">{errors.next_of_kin_relationship}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-4 col-span-3">
                            <h2 className="text-lg font-semibold">Additional Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="preferred_language">Preferred Language</Label>
                                    <Input
                                        id="preferred_language"
                                        value={data.preferred_language || ''}
                                        onChange={(e) => setData('preferred_language', e.target.value)}
                                        placeholder="E.g., English, Spanish, etc."
                                    />
                                    {errors.preferred_language && <p className="text-sm text-red-500">{errors.preferred_language}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="religion">Religion</Label>
                                    <Input
                                        id="religion"
                                        value={data.religion || ''}
                                        onChange={(e) => setData('religion', e.target.value)}
                                        placeholder="Enter religion"
                                    />
                                    {errors.religion && <p className="text-sm text-red-500">{errors.religion}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Link href={route('patients.show', {id: patient.id})}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Patient'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
