import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, router } from '@inertiajs/react';
import { useCallback } from 'react';
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
import { type BreadcrumbItem } from '@/types';
import { Allergy, Paginated } from '@/types/allergy';
import { Head } from '@inertiajs/react';

// Inline route definitions
const routes = {
    create: () => ({ url: '/allergies/create' }),
    edit: (id: number) => ({ url: `/allergies/${id}/edit` }),
    destroy: (id: number) => ({ url: `/allergies/${id}` }),
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Allergies',
        href: '/allergies',
    },
];

export default function AllergyIndex({
    allergies,
}: {
    allergies: Allergy[] | Paginated<Allergy>;
}) {
    const handleDelete = useCallback((id: number) => {
        if (confirm('Are you sure you want to delete this allergy?')) {
            router.delete(routes.destroy(id).url);
        }
    }, []);
    
    const rows: Allergy[] = Array.isArray(allergies)
        ? allergies
        : (allergies.data ?? []);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Allergies" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <Input placeholder="search allergies" />
                <Link href={routes.create().url} className="btn">
                    <Button>+ Add Allergy</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <Table className="min-w-[900px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Reaction Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((allergy) => (
                                <TableRow key={allergy.id}>
                                    <TableCell>{allergy.id}</TableCell>
                                    <TableCell>{allergy.name}</TableCell>
                                    <TableCell>{allergy.description}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            allergy.severity === 'severe' ? 'bg-red-100 text-red-800' :
                                            allergy.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {allergy.severity}
                                        </span>
                                    </TableCell>
                                    <TableCell>{allergy.reaction_type}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            allergy.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {allergy.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Link href={routes.edit(allergy.id).url}>
                                            <Button size="sm" variant="outline">
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button 
                                            size="sm" 
                                            variant="destructive"
                                            onClick={() => handleDelete(allergy.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="py-4 text-center"
                                >
                                    No allergies found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {(!Array.isArray(allergies) && allergies.links?.length) ? (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href={allergies.prev_page_url ?? undefined} />
                            </PaginationItem>

                            {allergies.links.map((link: { url?: string; label: string; active: boolean }, idx: number) => {
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
                                <PaginationNext href={allergies.next_page_url ?? undefined} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                ) : null}
            </div>
        </AppLayout>
    );
}
