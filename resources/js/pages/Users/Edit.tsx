import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Edit User',
        href: '#',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at?: string;
    roles?: Array<{
        id: number;
        name: string;
    }>;
}

export default function UsersEdit({ user }: { user: User }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/users/${user.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${user.name}`} />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Edit User</h1>
                <Link href="/users">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="m-2 rounded border p-6 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* User Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">User Information</h2>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter name"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter email"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Password Change */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Change Password (Optional)</h2>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Leave blank to keep current password"
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm new password"
                                />
                                {errors.password_confirmation && (
                                    <p className="text-sm text-red-500">{errors.password_confirmation}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Roles */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Current Roles</h2>
                        <div className="flex gap-2 flex-wrap">
                            {user.roles?.map((role) => (
                                <span key={role.id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    {role.name}
                                </span>
                            ))}
                            {!user.roles || user.roles.length === 0 && (
                                <p className="text-gray-500 text-sm">No roles assigned</p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-6">
                        <Link href="/users">
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update User'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
