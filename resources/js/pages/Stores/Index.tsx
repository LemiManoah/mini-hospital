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
import { Store } from '@/types/store';
import { Head, Link, router } from '@inertiajs/react';
import { create, edit, destroy } from '@/routes/stores';
import { useCallback } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Stores',
        href: dashboard().url,
    },
];

export default function Index({
    stores,
}: {
    stores: Store[] | Paginated<Store>;
}) {
    const handleDelete = useCallback((id: number) => {
        if (confirm('Are you sure you want to delete this store?')) {
            router.delete(destroy(id).url);
        }
    }, []);

    const rows: Store[] = Array.isArray(stores)
        ? stores
        : (stores.data ?? []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stores" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <Input placeholder="search stores" />
                <Link href={create().url}>
                    <Button>+ Add Store</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <Table className="min-w-[900px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Main Store</TableHead>
                            <TableHead>Direct Receipt</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((store) => (
                                <TableRow key={store.id}>
                                    <TableCell>{store.id}</TableCell>
                                    <TableCell>{store.name}</TableCell>
                                    <TableCell>{store.code}</TableCell>
                                    <TableCell>{store.is_main ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{store.allow_direct_receipt ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${
                                                store.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {store.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Link href={edit(store.id).url}>
                                            <Button size="sm" variant="outline">
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(store.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="py-4 text-center">
                                    No stores found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {(!Array.isArray(stores) && stores.links?.length) ? (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href={stores.prev_page_url ?? undefined} />
                            </PaginationItem>

                            {stores.links.map((link, idx) => {
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
                                <PaginationNext href={stores.next_page_url ?? undefined} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                ) : null}
            </div>
        </AppLayout>
    );
}
