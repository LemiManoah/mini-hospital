import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Clinic } from '@/types/clinic';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Clinics',
        href: '/clinics',
    },
    {
        title: 'Edit Clinic',
        href: '#',
    },
];

export default function ClinicEdit({ clinic }: { clinic?: Clinic }) {

    const [formData, setFormData] = useState({
        name: clinic?.name ?? '',
        status: clinic?.status ?? 'active',
    });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Clinic" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Edit Clinic</h1>
                <Link href="/clinics" className="btn">
                    <Button>Back</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">

                <Form method="put" action={`/clinics/${clinic?.id}`}>
                    <div className="mb-4">
                        <label className="block mb-2 font-bold" htmlFor="name">
                            Clinic Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter clinic name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-bold" htmlFor="status">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>
                    <Button type="submit">Update Clinic</Button>
                </Form>
            </div>
        </AppLayout>
    );
}
