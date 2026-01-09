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
        title: 'Addresses',
        href: '/addresses',
    },
    {
        title: 'Create Address',
        href: '#',
    },
];

export default function AddressCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Address" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Create Address</h1>
                <Link href="/addresses" className="btn">
                    <Button>Back</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">

                <Form method="post" action="/addresses">
                    <div className="mb-4">
                        <label className="block mb-2 font-bold" htmlFor="district">
                            District
                        </label>
                        <Input
                            id="district"
                            name="district"
                            type="text"
                            placeholder="Enter district"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-bold" htmlFor="city">
                            City
                        </label>
                        <Input
                            id="city"
                            name="city"
                            type="text"
                            placeholder="Enter city"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-bold" htmlFor="county">
                            County
                        </label>
                        <Input
                            id="county"
                            name="county"
                            type="text"
                            placeholder="Enter county"
                        />
                    </div>
                    <Button type="submit">Create Address</Button>
                </Form>
            </div>
        </AppLayout>
    );
}
