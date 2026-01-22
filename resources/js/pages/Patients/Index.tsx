import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
// import { route } from '@/utils/route'; 
import { create, edit, destroy, show, index } from '@/routes/patients';
import { Patient, PaginatedPatients } from '@/types/patient';




const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Patients',
        href: '#',
    },
];

export default function PatientIndex({ patients, filters }: { patients: PaginatedPatients; filters: { search?: string } }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(index.url({ query: { search } }), {}, { preserveState: true, replace: true });
    };

    const handleClear = () => {
        setSearch('');
        router.get(index.url({ query: {} }), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this patient?')) {
            router.delete(destroy(id).url);
        }
    };



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patients" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Patients</h1>
                <Link href={create().url} className="btn">
                    <Button>+ Add Patient</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <Input
                        placeholder="Search patients..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                    <div className="flex gap-2">
                        <Button type="submit" variant="outline">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                        {search && (
                            <Button type="button" variant="ghost" onClick={handleClear}>
                                Clear
                            </Button>
                        )}
                    </div>
                </form>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>PatientNumber</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Date of Birth</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patients.data.length > 0 ? (
                                patients.data.map((patient: Patient) => (
                                    <TableRow key={patient.id}>
                                        <TableCell className="font-medium">{patient.patient_number}</TableCell>
                                        <TableCell>{`${patient.first_name} ${patient.last_name}`}</TableCell>
                                        <TableCell>{patient.phone_number}</TableCell>
                                        <TableCell>{new Date(patient.date_of_birth).toLocaleDateString()}</TableCell>
                                        <TableCell className="capitalize">{patient.gender}</TableCell>
                                        <TableCell>{patient.patient_category?.name || '-'}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 text-xs rounded-full ${patient.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {patient.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Link href={show(patient.id).url}>
                                                <Button variant="outline" size="sm">
                                                    Select
                                                </Button>
                                            </Link>
                                            <Link href={edit(patient.id).url}>
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(patient.id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-4">
                                        No patients found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {patients.links && (
                    <div className="mt-4 flex justify-end">
                        <div className="flex items-center gap-2">
                            {patients.links.map((link, index: number) => (
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
