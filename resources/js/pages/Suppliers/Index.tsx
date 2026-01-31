import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Suppliers', href: '/suppliers' },
];

// Route helpers
const routes = {
    index: () => ({ url: '/suppliers' }),
    create: () => ({ url: '/suppliers/create' }),
    edit: (id: number) => ({ url: `/suppliers/${id}/edit` }),
    destroy: (id: number) => ({ url: `/suppliers/${id}` }),
};

export default function SupplierIndex({
    suppliers,
    filters,
}: {
    suppliers: { data: Array<any>; links: Array<{ url?: string; label: string; active: boolean }> };
    filters: { search?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(routes.index().url, { search }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this supplier?')) {
            router.delete(routes.destroy(id).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suppliers" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Suppliers</h1>
                <Link href={routes.create().url}>
                    <Button>+ New Supplier</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <Input
                        placeholder="Search suppliers"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                    <Button type="submit" variant="outline">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                </form>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Contact Person</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {suppliers.data.map((supplier, index) => (
                            <TableRow key={supplier.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{supplier.name}</p>
                                        {supplier.notes && (
                                            <p className="text-sm text-gray-500 truncate max-w-xs">
                                                {supplier.notes}
                                            </p>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{supplier.contact_person || '-'}</TableCell>
                                <TableCell>
                                    {supplier.email ? (
                                        <a href={`mailto:${supplier.email}`} className="text-blue-600 hover:underline">
                                            {supplier.email}
                                        </a>
                                    ) : '-'}
                                </TableCell>
                                <TableCell>
                                    {supplier.phone ? (
                                        <a href={`tel:${supplier.phone}`} className="text-blue-600 hover:underline">
                                            {supplier.phone}
                                        </a>
                                    ) : '-'}
                                </TableCell>
                                <TableCell>
                                    <div className="max-w-xs truncate">
                                        {supplier.address || '-'}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Link href={routes.edit(supplier.id).url}>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(supplier.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {suppliers.links && (
                    <div className="mt-4 flex justify-end">
                        <div className="flex items-center gap-2">
                            {suppliers.links.map((link, index: number) => (
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
