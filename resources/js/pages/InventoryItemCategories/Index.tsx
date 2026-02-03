import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
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
import { type BreadcrumbItem, Paginated } from '@/types';
import { InventoryItemCategory } from '@/types/inventory-item-category';
import { Head, Link, router } from '@inertiajs/react';
import { create, edit, destroy } from '@/routes/inventory-item-categories';
import { useCallback } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventory Item Categories',
        href: dashboard().url,
    },
];

export default function Index({
    inventoryItemCategories,
}: {
    inventoryItemCategories: InventoryItemCategory[] | Paginated<InventoryItemCategory>;
}) {
    const handleDelete = useCallback((id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(destroy(id).url);
        }
    }, []);

    const rows: InventoryItemCategory[] = Array.isArray(inventoryItemCategories)
        ? inventoryItemCategories
        : (inventoryItemCategories.data ?? []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory Item Categories" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <Input placeholder="search item categories" />
                <Link href={create().url}>
                    <Button>+ Add Item Category</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <Table className="min-w-[700px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.id}</TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${
                                                category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {category.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Link href={edit(category.id).url}>
                                            <Button size="sm" variant="outline">
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(category.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="py-4 text-center">
                                    No item categories found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {(!Array.isArray(inventoryItemCategories) && inventoryItemCategories.links?.length) ? (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href={inventoryItemCategories.prev_page_url ?? undefined} />
                            </PaginationItem>

                            {inventoryItemCategories.links.map((link, idx) => {
                                const label = link.label.replace(/<[^>]*>/g, '').trim();
                                if (label === '...') {
                                    return (
                                        <PaginationItem key={`ellipsis-${idx}`}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    );
                                }
                                if (/^\d+$/.test(label)) {
                                    return (
                                        <PaginationItem key={label}>
                                            <PaginationLink href={link.url ?? undefined} isActive={link.active}>
                                                {label}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                }
                                return null;
                            })}

                            <PaginationItem>
                                <PaginationNext href={inventoryItemCategories.next_page_url ?? undefined} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                ) : null}
            </div>
        </AppLayout>
    );
}
