import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { create, edit, destroy, show } from '@/routes/service-types';
import { ServiceType } from '@/types/service-type';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Service Types',
        href: '#',
    },
];

export default function ServiceTypeIndex({ serviceTypes }: { serviceTypes: ServiceType[] }) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this service type?')) {
            router.delete(destroy(id).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Service Types" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Service Types</h1>
                <Link href={create().url}>
                    <Button>+ Add Service Type</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {serviceTypes.length > 0 ? (
                                serviceTypes.map((serviceType: ServiceType) => (
                                    <TableRow key={serviceType.id}>
                                        <TableCell className="font-medium">{serviceType.name}</TableCell>
                                        <TableCell>{serviceType.description}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    serviceType.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {serviceType.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Link href={show(serviceType.id).url}>
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                            </Link>
                                            <Link href={edit(serviceType.id).url}>
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(serviceType.id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4">
                                        No service types found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
