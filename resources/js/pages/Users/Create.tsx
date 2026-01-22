import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';
import { index as usersIndexRoute } from '@/routes/users';
// import { SelectGroup } from '@/components/ui/select';
import { Role } from '@/types/roles';


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Users', href: usersIndexRoute().url },
    { title: 'Create User', href: '#' },
];

type Option = {
    value: string;
    label: string;
    disabled?: boolean;
    name?: string;
};

type Props = {
    clinics: Array<{ id: number; name: string }>;
    addresses: Array<{ id: number; display_name: string }>;
    genders: Option[];
    roles: Role[];
};

export default function UserCreate({
    clinics = [],
    addresses = [],
    genders = [],
    roles = [],
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        gender: '',
        phone_number: '',
        alternative_phone_number: '',
        clinic_id: '',
        address_id: '',
        roles: [] as string[],
    });

    const handleRoleChange = (roleId: string, isChecked: boolean) => {
        const updatedRoles = isChecked
            ? [...data.roles, roleId]
            : data.roles.filter((r) => r !== roleId);
        setData('roles', updatedRoles);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/users');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />

            {/* Header */}
            <div className="mt-4 mb-4 flex items-center gap-2 px-4">
                <Link href={usersIndexRoute().url}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Create User</h1>
            </div>

            <div className="m-2 rounded border p-6 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* User Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">User Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter full name"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>
                            
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@example.com"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter password"
                                    required
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password}</p>
                                )}
                            </div>
                            
                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Confirm Password *</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm password"
                                    required
                                />
                                {errors.password_confirmation && (
                                    <p className="text-sm text-red-500">{errors.password_confirmation}</p>
                                )}
                            </div>
                        </div>

                        {/* Role */}
                        <div className="space-y-3">
                            <Label>Roles</Label>
                            <div className="space-y-2 border rounded p-3 bg-slate-50">
                                {roles.length > 0 ? (
                                    roles.map((role) => (
                                        <div key={role.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`role-${role.id}`}
                                                checked={data.roles.includes(String(role.id))}
                                                onCheckedChange={(isChecked) =>
                                                    handleRoleChange(String(role.id), isChecked as boolean)
                                                }
                                            />
                                            <Label
                                                htmlFor={`role-${role.id}`}
                                                className="font-normal cursor-pointer"
                                            >
                                                {role.name}
                                            </Label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No roles available</p>
                                )}
                            </div>
                            {errors.roles && (
                                <p className="text-sm text-red-500">{errors.roles}</p>
                            )}
                        </div>
                    </div>

                    {/* Staff Profile Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Staff Profile Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Gender */}
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select
                                    value={data.gender}
                                    onValueChange={(value) => setData('gender', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {genders.map((gender) => (
                                            <SelectItem
                                                key={gender.value}
                                                value={gender.value}
                                            >
                                                {gender.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.gender && (
                                    <p className="text-sm text-red-500">{errors.gender}</p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <Label htmlFor="phone_number">Phone Number</Label>
                                <Input
                                    id="phone_number"
                                    type="tel"
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    placeholder="Enter phone number"
                                />
                                {errors.phone_number && (
                                    <p className="text-sm text-red-500">{errors.phone_number}</p>
                                )}
                            </div>

                            {/* Alternative Phone Number */}
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

                            {/* Clinic */}
                            <div className="space-y-2">
                                <Label htmlFor="clinic_id">Clinic (Optional)</Label>
                                <Select
                                    value={data.clinic_id}
                                    onValueChange={(value) => setData('clinic_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select clinic" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clinics.map((clinic) => (
                                            <SelectItem
                                                key={clinic.id}
                                                value={String(clinic.id)}
                                            >
                                                {clinic.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.clinic_id && (
                                    <p className="text-sm text-red-500">{errors.clinic_id}</p>
                                )}
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <Label htmlFor="address_id">Address</Label>
                                <Select
                                    value={data.address_id}
                                    onValueChange={(value) => setData('address_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select address" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {addresses.map((address) => (
                                            <SelectItem
                                                key={address.id}
                                                value={String(address.id)}
                                            >
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
                        <Link href={usersIndexRoute().url}>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
