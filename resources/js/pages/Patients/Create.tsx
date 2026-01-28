import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';
import { index as indexRoute } from '@/routes/patients';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Patients',
        href: indexRoute().url,
    },
    {
        title: 'Create Patient',
        href: '#',
    },
];

type Option = {
    value: string;
    label: string;
};

type Props = {
    patientCategories: Array<{ id: number; name: string }>;
    addresses: Array<{ id: number; display_name: string }>;
    countries: Array<{ id: number; name: string }>;
    genders: Option[];
    maritalStatuses: Option[];
    religions: Option[];
    kinRelationships: Option[];
};

export default function PatientCreate({
    patientCategories = [],
    addresses = [],
    countries = [],
    genders = [],
    maritalStatuses = [],
    religions = [],
    kinRelationships = [],
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        marital_status: '',
        preferred_language: '',
        religion: '',
        country_id: '',
        address_id: '',
        patient_category_id: '',
        registration_date: new Date().toISOString().split('T')[0],
        phone_number: '',
        alternative_phone_number: '',
        phone_owner: true,
        next_of_kin_name: '',
        next_of_kin_number: '',
        next_of_kin_relationship: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/patients');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Patient" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href={indexRoute().url} className="mr-2">
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
                                    <Label>Patient Number</Label>
                                    <Input value="Auto-generated" disabled />
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
                                        name="date_of_birth"
                                        type="date"
                                        required
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                    />
                                    {errors.date_of_birth && <p className="text-sm text-red-500">{errors.date_of_birth}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender *</Label>
                                    <Select name="gender" required value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {genders.map((gender) => (
                                                <SelectItem key={gender.value} value={gender.value}>
                                                    {gender.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="marital_status">Marital Status *</Label>
                                    <Select name="marital_status" required value={data.marital_status} onValueChange={(value) => setData('marital_status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {maritalStatuses.map((status) => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.marital_status && <p className="text-sm text-red-500">{errors.marital_status}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="religion">Religion</Label>
                                    <Select name="religion" value={data.religion} onValueChange={(value) => setData('religion', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select religion" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {religions.map((religion) => (
                                                <SelectItem key={religion.value} value={religion.value}>
                                                    {religion.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.religion && <p className="text-sm text-red-500">{errors.religion}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone_number">Phone Number *</Label>
                                    <Input
                                        id="phone_number"
                                        name="phone_number"
                                        placeholder="+256 XXX XXX XXX"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        required
                                    />
                                    {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="alternative_phone_number">Alternative Phone</Label>
                                    <Input
                                        id="alternative_phone_number"
                                        name="alternative_phone_number"
                                        placeholder="+256 XXX XXX XXX"
                                        value={data.alternative_phone_number}
                                        onChange={(e) => setData('alternative_phone_number', e.target.value)}
                                    />
                                    {errors.alternative_phone_number && <p className="text-sm text-red-500">{errors.alternative_phone_number}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country_id">Country</Label>
                                    <Select name="country_id" value={data.country_id} onValueChange={(value) => setData('country_id', value)}>
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
                                    <Label htmlFor="address_id">Address</Label>
                                    <Select name="address_id" value={data.address_id} onValueChange={(value) => setData('address_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select address" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {addresses.map((address) => (
                                                <SelectItem key={address.id} value={String(address.id)}>
                                                    {address.display_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.address_id && <p className="text-sm text-red-500">{errors.address_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="patient_category_id">Patient Billing Type</Label>
                                    <Select name="patient_category_id" value={data.patient_category_id} onValueChange={(value) => setData('patient_category_id', value)}>
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

                                {/* Next of Kin */}
                                <div className="space-y-4 col-span-3">
                                    <h2 className="text-lg font-semibold">Next of Kin</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="next_of_kin_name">Name</Label>
                                            <Input
                                                id="next_of_kin_name"
                                                name="next_of_kin_name"
                                                type="text"
                                                placeholder="Full name"
                                                value={data.next_of_kin_name}
                                                onChange={(e) => setData('next_of_kin_name', e.target.value)}
                                            />
                                            {errors.next_of_kin_name && <p className="text-sm text-red-500">{errors.next_of_kin_name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="next_of_kin_number">Phone Number</Label>
                                            <Input
                                                id="next_of_kin_number"
                                                name="next_of_kin_number"
                                                type="tel"
                                                placeholder="+256 XXX XXX XXX"
                                                value={data.next_of_kin_number}
                                                onChange={(e) => setData('next_of_kin_number', e.target.value)}
                                            />
                                            {errors.next_of_kin_number && <p className="text-sm text-red-500">{errors.next_of_kin_number}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="next_of_kin_relationship">Relationship</Label>
                                            <Select name="next_of_kin_relationship" value={data.next_of_kin_relationship} onValueChange={(value) => setData('next_of_kin_relationship', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select relationship" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {kinRelationships.map((relation) => (
                                                        <SelectItem key={relation.value} value={relation.value}>
                                                            {relation.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.next_of_kin_relationship && <p className="text-sm text-red-500">{errors.next_of_kin_relationship}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Registration & Status */}
                                <div className="space-y-4 col-span-3">
                                    <h2 className="text-lg font-semibold">Registration</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="registration_date">Registration Date *</Label>
                                            <Input
                                                id="registration_date"
                                                name="registration_date"
                                                type="date"
                                                required
                                                value={data.registration_date}
                                                onChange={(e) => setData('registration_date', e.target.value)}
                                            />
                                            {errors.registration_date && <p className="text-sm text-red-500">{errors.registration_date}</p>}
                                        </div>
                                    </div>
                                </div>



                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Link href={indexRoute().url}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Patient'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
