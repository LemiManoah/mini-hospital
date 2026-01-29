import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { LabServiceCategory } from '@/types/lab';
import { index, create, edit, destroy} from '@/routes/lab-service-categories';
import { dashboard } from '@/routes';


const breadcrumbs: BreadcrumbItem[] = [
    {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Lab Service Categories',
            href: index().url,
        },
];

export default function LabServiceCategoryIndex({
    labServiceCategories,
    filters,
}: {
    labServiceCategories: { data: LabServiceCategory[]; links: Array<{ url?: string; label: string; active: boolean }> };
    filters: { search?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(index().url, { search }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(destroy(id).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lab Service Categories" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Lab Service Categories</h1>
                <Link href={create()}>
                    <Button>+ New Category</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <Input
                        placeholder="Search categories"
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
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {labServiceCategories.data?.map((category, index) => (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell>{category.description ?? '-'}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {category.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Link href={edit(category.id)}>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </Link>
                                        <Button 
                                            size="sm" 
                                            variant="destructive"
                                            onClick={() => handleDelete(category.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {labServiceCategories.links?.length > 0 && (
                    <div className="mt-4 flex justify-end">
                        <div className="flex items-center gap-2">
                            {labServiceCategories.links.map((link, index: number) => (
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
