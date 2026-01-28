import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

type Method = {
    id: number;
    code: string;
    name: string;
    description?: string | null;
    is_active: boolean;
};

type Props = {
    methods: Method[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Appointment Methods', href: '/appointment-methods' },
];

export default function AppointmentMethodIndex({ methods }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this method?')) {
            router.delete(`/appointment-methods/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appointment Methods" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Appointment Methods</h1>
                <Link href="/appointment-methods/create">
                    <Button>+ Add Method</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <Table className="min-w-[900px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {methods.length > 0 ? (
                            methods.map((method) => (
                                <TableRow key={method.id}>
                                    <TableCell>{method.code}</TableCell>
                                    <TableCell>{method.name}</TableCell>
                                    <TableCell>{method.is_active ? 'Yes' : 'No'}</TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Link href={`/appointment-methods/${method.id}/edit`}>
                                            <Button size="sm" variant="outline">Edit</Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(method.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="py-4 text-center">
                                    No methods found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
