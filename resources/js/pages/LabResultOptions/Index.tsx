import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { LabResultOption } from '@/types/lab';
import { create, edit, destroy, show, index } from '@/routes/lab-result-options';
import { dashboard } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Lab Result Options', href: index().url },
];

export default function LabResultOptionIndex({
    labResultOptions,
    filters,
}: {
    labResultOptions: { data: LabResultOption[]; links: Array<{ url?: string; label: string; active: boolean }> };
    filters: { search?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');

        const handleSearch = (e: React.FormEvent) => {
            e.preventDefault();
            router.get(index.url({ query: { search } }), {}, { preserveState: true, replace: true });
        };
            const handleDelete = (id: number) => {
                if (confirm('Are you sure you want to delete this lab option?')) {
                    router.delete(destroy(id).url);
                }
            };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lab Result Options" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Lab Result Options</h1>
                <Link href={create().url}>
                    <Button>+ New Result Option</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <Input
                        placeholder="Search result options"
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
                            <TableHead>Lab Test</TableHead>
                            <TableHead>Option Value</TableHead>
                            <TableHead>Label</TableHead>
                            <TableHead>Abnormal</TableHead>
                            <TableHead>Sort Order</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {labResultOptions.data.map((option) => (
                            <TableRow key={option.id}>
                                <TableCell className="font-medium">{option.lab_test?.name ?? '-'}</TableCell>
                                <TableCell>{option.option_value}</TableCell>
                                <TableCell>{option.label}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${option.is_abnormal ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {option.is_abnormal ? 'Abnormal' : 'Normal'}
                                    </span>
                                </TableCell>
                                <TableCell>{option.sort_order}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Link href={edit(option.id).url}>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </Link>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(option.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {labResultOptions.links && (
                    <div className="mt-4 flex justify-end">
                        <div className="flex items-center gap-2">
                            {labResultOptions.links.map((link, index: number) => (
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
