import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { LabService } from '@/types/lab';
import { index, create, edit, destroy } from '@/routes/lab-services';
import { dashboard } from '@/routes'



const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Lab Services', href: index().url },
];

export default function LabServiceIndex({
    labServices,
    categories,
    filters,
}: {
    labServices: { data: LabService[]; links: Array<{ url?: string; label: string; active: boolean }> };
    categories: { data: Array<{ id: number; name: string }> };
    filters: { search?: string; category?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const nextCategory = category === 'all' ? '' : category;
        router.get(index().url, { search, category: nextCategory }, { preserveState: true, replace: true });
    };

    const handleCategoryChange = (value: string) => {
        const nextCategory = value === 'all' ? '' : value;
        setCategory(value);
        router.get(index().url, { search, category: nextCategory }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this lab service?')) {
            router.delete(destroy(id).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lab Services" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Lab Services</h1>
                <Link href={create().url}>
                    <Button>+ New Lab Service</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <Input
                        placeholder="Search lab services"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                    <Select value={category} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.data.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button type="submit" variant="outline">
                        <Search className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                </form>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Sample Type</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {labServices.data.map((service, index) => (
                            <TableRow key={service.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell className="font-medium">{service.code}</TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{service.name}</p>
                                        {service.description && (
                                            <p className="text-sm text-gray-500 truncate max-w-xs">
                                                {service.description}
                                            </p>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{service.labServiceCategory?.name ?? service.lab_service_category?.name ?? '-'}</TableCell>
                                <TableCell>
                                    {service.sampleType?.code || service.sample_type?.code
                                        ? `${service.sampleType?.code ?? service.sample_type?.code} - ${service.sampleType?.name ?? service.sample_type?.name}`
                                        : service.sample_type_code ?? '-'}
                                </TableCell>
                                <TableCell>UGX{typeof service.price === 'number' ? Math.round(service.price) : Math.round(parseFloat(service.price))}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {service.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Link href={edit(service.id).url}>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(service.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {labServices.links && (
                    <div className="mt-4 flex justify-end">
                        <div className="flex items-center gap-2">
                            {labServices.links.map((link, index: number) => (
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
