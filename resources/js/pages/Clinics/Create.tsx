import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Form } from '@inertiajs/react'
import { Link } from '@inertiajs/react';


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
        title: 'Create Clinic',
        href: '#',
    },
];

export default function ClinicCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Clinic" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Create Clinic</h1>
                <Link href="/clinics" className="btn">
                    <Button>Back</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">

                <Form method="post" action="/clinics">
                    <div className="mb-4">
                        <label className="block mb-2 font-bold" htmlFor="name">
                            Clinic Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter clinic name"
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
                            defaultValue="active"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>
                    <Button type="submit">Create Clinic</Button>
                </Form>
            </div>
        </AppLayout>
    );
}
