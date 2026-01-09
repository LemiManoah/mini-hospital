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
import { PatientCategory } from '@/types/patientcategories';
import { Paginated } from '@/types';
import { Head } from '@inertiajs/react';
import { Link, router } from '@inertiajs/react';
import { create, edit, destroy} from '@/routes/patient-categories';
import { useCallback } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Patient Categories',
        href: dashboard().url,
    },
];

export default function Index({
    patientCategories,
}: {
    patientCategories: PatientCategory[] | Paginated<PatientCategory>;
}) {
    const handleDelete = useCallback((id: number) => {
        if (confirm('Are you sure you want to delete this patient category?')) {
            router.delete(destroy(id).url);
        }
    }, []);
    const rows: PatientCategory[] = Array.isArray(patientCategories)
        ? patientCategories
        : (patientCategories.data ?? []);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patient Categories" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <Input placeholder="search patient categories" />
                <Link href={create().url }>
                    <Button>+ Add Patient Category</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <Table className="min-w-[900px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Is Insurance</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((patientCategory) => (
                                <TableRow key={patientCategory.id}>
                                    <TableCell>{patientCategory.id}</TableCell>
                                    <TableCell>{patientCategory.name}</TableCell>
                                    <TableCell>{patientCategory.is_insurance ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>
                                            <span className={`px-2 py-1 text-xs rounded-full ${patientCategory.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {patientCategory.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Link href={edit(patientCategory.id).url}>
                                            <Button size="sm" variant="outline">
                                            Edit
                                            </Button>
                                        </Link>
                                        <Button 
                                            size="sm" 
                                            variant="destructive"
                                            onClick={() => handleDelete(patientCategory.id)}
                                        >
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
                                    No patient categories found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {(!Array.isArray(patientCategories) && patientCategories.links?.length) ? (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href={patientCategories.prev_page_url ?? undefined} />
                            </PaginationItem>

                            {patientCategories.links.map((link, idx) => {
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
                                <PaginationNext href={patientCategories.next_page_url ?? undefined} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                ) : null}
            </div>
        </AppLayout>
    );
}
