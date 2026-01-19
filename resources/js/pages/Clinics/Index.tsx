import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, router } from '@inertiajs/react';
import { useCallback } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Clinic, PaginatedClinics } from '@/types/clinic';
import { Head } from '@inertiajs/react';
import { create, edit, destroy} from '@/routes/clinics';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Clinics',
        href: '/clinics',
    },
];


export default function ClinicIndex({
    clinics,
}: {
    clinics: PaginatedClinics;
}) {
    const handleDelete = useCallback((id: number) => {
        if (confirm('Are you sure you want to delete this clinic?')) {
            router.delete(destroy(id).url);
        }
    }, []);
    
    const rows: Clinic[] = clinics.data;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clinics" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <Input placeholder="search clinics" />
                <Link href={create().url} className="btn">
                    <Button>+ Add Clinic</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <Table className="min-w-[900px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((clinic) => (
                                <TableRow key={clinic.id}>
                                    <TableCell>{clinic.id}</TableCell>
                                    <TableCell>{clinic.name}</TableCell>
                                    <TableCell>{clinic.status}</TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Link href={edit(clinic.id).url}>
                                            <Button size="sm" variant="outline">
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button 
                                            size="sm" 
                                            variant="destructive"
                                            onClick={() => handleDelete(clinic.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="py-4 text-center"
                                >
                                    No clinics found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {clinics.links && (
                    <div className="mt-4 flex justify-end">
                        <div className="flex items-center gap-2">
                            {clinics.links.map((link, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => router.get(link.url || '#')}
                                    className={`px-3 py-1 rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-100'} ${!link.url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
