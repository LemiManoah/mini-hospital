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
import { create, index} from '@/routes/patients';
import { PatientCategory } from '@/types/patientcategories';
import { Address } from '@/types/address';

type Country = {
    id: number;
    name: string;
}


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Patients',
        href: index().url,
    },
    {
        title: 'Create Patient',
        href: '#',
    },
];

interface SelectOption {
    value: string;
    label: string;
}

export default function PatientCreate({ 
    patientCategories = [], 
    addresses = [],
    countries = [],
    religions = [],
    kinRelationships = [], 
    genders = [], 
    maritalStatuses = [],
}: { 
    patientCategories?: PatientCategory[], 
    addresses?: Address[], 
    countries?: Country[], 
    kinRelationships?: SelectOption[], 
    genders?: SelectOption[], 
    maritalStatuses?: SelectOption[],
    religions?: SelectOption[] 
}) {
    const { data, setData, post, processing, errors } = useForm({
        patient_number: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        marital_status: '',
        is_pediatric: false,
        age_years: null as number | null,
        age_months: null as number | null,
        preferred_language: '',
        religion: '',
        country_id: null as number | null,
        address_id: null as number | null,
        registration_date: new Date().toISOString().split('T')[0],
        is_active: true,
        patient_category_id: '',
        next_of_kin_name: '',
        next_of_kin_number: '',
        next_of_kin_relationship: '',
        phone_number: '',
        alternative_phone_number: '',
        phone_owner: true,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(create().url);
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Patient" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href={index().url} className="mr-2">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Create New Patient</h1>
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
                                        placeholder="Auto-generated"
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
                                            {
                                                genders.map((gender) => (
                                                    <SelectItem key={gender.value} value={gender.value}>
                                                        {gender.label}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="religion">Religion</Label>
                                    <Select
                                        value={data.religion}
                                        onValueChange={(value) => setData('religion', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select religion" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                religions.map((religion) => (
                                                    <SelectItem key={religion.value} value={religion.value}>
                                                        {religion.label}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    {errors.religion && <p className="text-sm text-red-500">{errors.religion}</p>}
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
                                            {
                                                maritalStatuses.map((status) => (
                                                    <SelectItem key={status.value} value={status.value}>
                                                        {status.label}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    {errors.marital_status && <p className="text-sm text-red-500">{errors.marital_status}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address_id">Address *</Label>
                                    <Select
                                        value={data.address_id}
                                        onValueChange={(value) => setData('address_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select address" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {addresses.map((address) => (
                                                <SelectItem key={address.id} value={String(address.id)}>
                                                    {address.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.address_id && <p className="text-sm text-red-500">{errors.address_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country_id">Country *</Label>
                                    <Select
                                        value={data.country_id}
                                        onValueChange={(value) => setData('country_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem key={country.id} value={String(country.id)}>
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.country_id && <p className="text-sm text-red-500">{errors.country_id}</p>}
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
                                    <Select
                                        value={data.marital_status}
                                        onValueChange={(value) => setData('marital_status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                kinRelationships.map((relationship) => (
                                                    <SelectItem key={relationship.value} value={relationship.value}>
                                                        {relationship.label}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    {errors.next_of_kin_relationship && <p className="text-sm text-red-500">{errors.next_of_kin_relationship}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Link href={index().url}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Patient'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
