import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { index as indexRoute } from '@/routes/staff-profile';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Staff Profiles', href: indexRoute().url },
    { title: 'Create Staff Profile', href: '#' },
];

interface CreateStaffProfileProps {
    clinics: Array<{ id: number; name: string }>;
    addresses: Array<{ id: number; display_name: string }>;
    countries: Array<{ id: number; name: string }>;
    genders: Array<{ value: string; label: string }>;
}

export default function StaffProfileCreate({
    clinics,
    addresses,
    genders,
}: CreateStaffProfileProps) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        staff_number: '',
        gender: '',
        phone_number: '',
        alternative_phone_number: '',
        user_id: '',
        clinic_id: '',
        address_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/staff-profile');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Staff Profile" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Create Staff Profile</h1>
                <Link href={indexRoute().url}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="m-2 rounded border p-6 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Personal Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name *</Label>
                                <Input
                                    id="first_name"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    placeholder="Enter first name"
                                    required
                                />
                                {errors.first_name && (
                                    <p className="text-sm text-red-500">{errors.first_name}</p>
                                )}
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
                                {errors.last_name && (
                                    <p className="text-sm text-red-500">{errors.last_name}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter email"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender *</Label>
                                <Select value={data.gender} onValueChange={(value) => setData('gender', value)} required>
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
                                {errors.gender && (
                                    <p className="text-sm text-red-500">{errors.gender}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Contact Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone_number">Phone Number *</Label>
                                <Input
                                    id="phone_number"
                                    type="tel"
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    placeholder="Enter phone number"
                                    required
                                />
                                {errors.phone_number && (
                                    <p className="text-sm text-red-500">{errors.phone_number}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="alternative_phone_number">Alternative Phone Number</Label>
                                <Input
                                    id="alternative_phone_number"
                                    type="tel"
                                    value={data.alternative_phone_number}
                                    onChange={(e) => setData('alternative_phone_number', e.target.value)}
                                    placeholder="Enter alternative phone number"
                                />
                                {errors.alternative_phone_number && (
                                    <p className="text-sm text-red-500">{errors.alternative_phone_number}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Work Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Work Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="clinic_id">Clinic</Label>
                                <Select value={data.clinic_id} onValueChange={(value) => setData('clinic_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select clinic" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">No clinic assigned</SelectItem>
                                        {clinics.map((clinic) => (
                                            <SelectItem key={clinic.id} value={clinic.id.toString()}>
                                                {clinic.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.clinic_id && (
                                    <p className="text-sm text-red-500">{errors.clinic_id}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="address_id">Address</Label>
                                <Select value={data.address_id} onValueChange={(value) => setData('address_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select address" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">No address assigned</SelectItem>
                                        {addresses.map((address) => (
                                            <SelectItem key={address.id} value={address.id.toString()}>
                                                {address.display_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.address_id && (
                                    <p className="text-sm text-red-500">{errors.address_id}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-6">
                        <Link href={indexRoute().url}>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Staff Profile'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
