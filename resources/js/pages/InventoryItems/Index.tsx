import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { create, edit, destroy, show, index } from '@/routes/inventory-items';
import { InventoryItem, PaginatedInventoryItems } from '@/types/inventory-item';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Inventory Items',
        href: index().url,
    },
];

export default function InventoryItemIndex({
    items,
    filters,
}: {
    items: PaginatedInventoryItems;
    filters: { search?: string };
}) {
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
        if (confirm('Are you sure you want to delete this item?')) {
            router.delete(destroy(id).url);
        }
    };

    const formatType = (type: InventoryItem['item_type']) =>
        type === 'general_supply' ? 'General Supply' : type.charAt(0).toUpperCase() + type.slice(1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory Items" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Inventory Items</h1>
                <Link href={create().url} className="btn">
                    <Button>+ Add Item</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <Input
                        placeholder="Search items..."
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
                                <TableHead>Code</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.data.length > 0 ? (
                                items.data.map((item: InventoryItem) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.code}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{formatType(item.item_type)}</TableCell>
                                        <TableCell>{item.category?.name || '-'}</TableCell>
                                        <TableCell>{item.unit_of_measure}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    item.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {item.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Link href={show(item.id).url}>
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                            </Link>
                                            <Link href={edit(item.id).url}>
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-4">
                                        No inventory items found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {items.links && (
                    <div className="mt-4 flex justify-end">
                        <div className="flex items-center gap-2">
                            {items.links.map((link, index: number) => (
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
