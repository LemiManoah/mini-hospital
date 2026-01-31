import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Medical Units', href: '/medical-units' },
];

// Route helpers
const routes = {
    index: () => ({ url: '/medical-units' }),
    create: () => ({ url: '/medical-units/create' }),
    edit: (id: number) => ({ url: `/medical-units/${id}/edit` }),
    destroy: (id: number) => ({ url: `/medical-units/${id}` }),
};

export default function MedicalUnitsIndex({
    medicalUnits,
    categories,
    filters,
}: {
    medicalUnits: any;
    categories: string[];
    filters: { search?: string; category?: string };
}) {
    const handleDelete = useCallback((id: number) => {
        if (confirm('Are you sure you want to delete this medical unit?')) {
            router.delete(routes.destroy(id).url);
        }
    }, []);

    const handleSearch = useCallback((search: string) => {
        router.get('/medical-units', { ...filters, search }, { preserveState: true });
    }, [filters]);

    const handleCategoryFilter = useCallback((category: string) => {
        const categoryValue = category === 'all' ? '' : category;
        router.get('/medical-units', { ...filters, category: categoryValue }, { preserveState: true });
    }, [filters]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Medical Units" />

            <div className="mx-auto max-w-7xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Medical Units</h1>
                    <Link href={routes.create().url}>
                        <Button>+ Add Medical Unit</Button>
                    </Link>
                </div>

                <div className="mb-6 flex gap-4">
                    <Input
                        placeholder="Search medical units..."
                        value={filters.search || ''}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select value={filters.category || 'all'} onValueChange={handleCategoryFilter}>
                        <SelectTrigger className="max-w-xs">
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {medicalUnits.data?.map((unit: any) => (
                                <TableRow key={unit.id}>
                                    <TableCell className="font-medium">{unit.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{unit.code}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                unit.category === 'solid'
                                                    ? 'default'
                                                    : unit.category === 'liquid'
                                                    ? 'secondary'
                                                    : unit.category === 'topical'
                                                    ? 'outline'
                                                    : 'destructive'
                                            }
                                        >
                                            {unit.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">
                                        {unit.description || '—'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={unit.is_active ? 'default' : 'secondary'}
                                        >
                                            {unit.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Link href={routes.edit(unit.id).url}>
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(unit.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {medicalUnits.data && (
                    <div className="mt-4">
                        <Pagination>
                            <PaginationContent>
                                {medicalUnits.links?.map((link: any, index: number) => (
                                    <PaginationItem key={index}>
                                        {link.url ? (
                                            <PaginationLink href={link.url}>
                                                {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                            </PaginationLink>
                                        ) : (
                                            <span className="px-3 py-2">{link.label}</span>
                                        )}
                                    </PaginationItem>
                                ))}
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
