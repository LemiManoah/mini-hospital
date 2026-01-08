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
import { type BreadcrumbItem } from '@/types';
import { Address, Paginated } from '@/types/address';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Addresses',
        href: dashboard().url,
    },
];

export default function AddressIndex({
    addresses,
}: {
    addresses: Address[] | Paginated<Address>;
}) {
    const rows: Address[] = Array.isArray(addresses)
        ? addresses
        : (addresses.data ?? []);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Addresses" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <Input placeholder="search addresses" />
                <Button>+ Add Address</Button>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <Table className="min-w-[900px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>District</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>County</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((address) => (
                                <TableRow key={address.id}>
                                    <TableCell>{address.id}</TableCell>
                                    <TableCell>{address.district}</TableCell>
                                    <TableCell>{address.city}</TableCell>
                                    <TableCell>{address.county}</TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Button size="sm" variant="outline">
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="destructive">
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
                                    No addresses found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {(!Array.isArray(addresses) && addresses.links?.length) ? (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href={addresses.prev_page_url ?? undefined} />
                            </PaginationItem>

                            {addresses.links.map((link, idx) => {
                                // Strip HTML tags from label
                                const label = link.label.replace(/<[^>]*>/g, '').trim();
                                if (label === '...') {
                                    return (
                                        <PaginationItem key={`ellipsis-${idx}`}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    );
                                }
                                // Render numeric page links
                                if (/^\d+$/.test(label)) {
                                    return (
                                        <PaginationItem key={label}>
                                            <PaginationLink href={link.url ?? undefined} isActive={link.active}>
                                                {label}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                }
                                // skip non-numeric labels (previous/next are handled separately)
                                return null;
                            })}

                            <PaginationItem>
                                <PaginationNext href={addresses.next_page_url ?? undefined} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                ) : null}
            </div>
        </AppLayout>
    );
}
