import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { StaffProfile } from '@/types/staff-profile';

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
        title: 'Edit Staff Profile',
        href: '#',
    },
];

interface EditStaffProfileProps {
    staffProfile?: StaffProfile;
    clinics: Array<{ id: number; name: string }>;
    addresses: Array<{ id: number; display_name: string }>;
    countries: Array<{ id: number; name: string }>;
}

export default function StaffProfileEdit({ 
    staffProfile, 
    clinics, 
    addresses, 
    countries 
}: EditStaffProfileProps) {
    const [formData, setFormData] = useState({
        first_name: staffProfile?.first_name ?? '',
        last_name: staffProfile?.last_name ?? '',
        email: staffProfile?.email ?? '',
        phone_number: staffProfile?.phone_number ?? '',
        alternative_phone_number: staffProfile?.alternative_phone_number ?? '',
        gender: staffProfile?.gender ?? '',
        clinic_id: staffProfile?.clinic_id?.toString() ?? '',
        address_id: staffProfile?.address_id?.toString() ?? '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Staff Profile" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Edit Staff Profile</h1>
                <Link href="/staff-profile" className="btn">
                    <Button>Back</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <Form method="put" action={`/staff-profile/${staffProfile?.id}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <Label className="block mb-2 font-bold" htmlFor="first_name">
                                First Name
                            </Label>
                            <Input
                                id="first_name"
                                name="first_name"
                                type="text"
                                placeholder="Enter first name"
                                value={formData.first_name}
                                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Label className="block mb-2 font-bold" htmlFor="last_name">
                                Last Name
                            </Label>
                            <Input
                                id="last_name"
                                name="last_name"
                                type="text"
                                placeholder="Enter last name"
                                value={formData.last_name}
                                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Label className="block mb-2 font-bold" htmlFor="email">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div className="mb-4">
                            <Label className="block mb-2 font-bold" htmlFor="phone_number">
                                Phone Number
                            </Label>
                            <Input
                                id="phone_number"
                                name="phone_number"
                                type="tel"
                                placeholder="Enter phone number"
                                value={formData.phone_number}
                                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Label className="block mb-2 font-bold" htmlFor="alternative_phone_number">
                                Alternative Phone Number
                            </Label>
                            <Input
                                id="alternative_phone_number"
                                name="alternative_phone_number"
                                type="tel"
                                placeholder="Enter alternative phone number"
                                value={formData.alternative_phone_number}
                                onChange={(e) => setFormData({...formData, alternative_phone_number: e.target.value})}
                            />
                        </div>
                        <div className="mb-4">
                            <Label className="block mb-2 font-bold" htmlFor="gender">
                                Gender
                            </Label>
                            <Select name="gender" value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mb-4">
                            <Label className="block mb-2 font-bold" htmlFor="clinic_id">
                                Clinic
                            </Label>
                            <Select name="clinic_id" value={formData.clinic_id} onValueChange={(value) => setFormData({...formData, clinic_id: value})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select clinic" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No clinic assigned</SelectItem>
                                    {clinics.map((clinic) => (
                                        <SelectItem key={clinic.id} value={clinic.id.toString()}>
                                            {clinic.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mb-4">
                            <Label className="block mb-2 font-bold" htmlFor="address_id">
                                Address
                            </Label>
                            <Select name="address_id" value={formData.address_id} onValueChange={(value) => setFormData({...formData, address_id: value})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select address" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No address assigned</SelectItem>
                                    {addresses.map((address) => (
                                        <SelectItem key={address.id} value={address.id.toString()}>
                                            {address.display_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <Button type="submit">Update Staff Profile</Button>
                    </div>
                </Form>
            </div>
        </AppLayout>
    );
}
