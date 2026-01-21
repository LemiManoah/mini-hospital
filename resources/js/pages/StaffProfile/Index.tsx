import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, router } from '@inertiajs/react';
import { useCallback } from 'react';
import React from 'react';
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
import { Head } from '@inertiajs/react';
import { StaffProfile, PaginatedStaffProfile } from '@/types/staff-profile';
import { create, edit, destroy } from '@/routes/staff-profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Staff Profiles',
        href: '/staff-profile',
    },
];

export default function StaffProfileIndex({
    staffProfiles,
    filters,
}: {
    staffProfiles: StaffProfile[] | PaginatedStaffProfile;
    filters?: {
        search?: string;
    };
}) {
    const handleDelete = useCallback((id: number) => {
        if (confirm('Are you sure you want to delete this staff profile?')) {
            router.delete(destroy(id).url);
        }
    }, []);

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const search = formData.get('search') as string;
        
        const params = new URLSearchParams(window.location.search);
        if (search) {
            params.set('search', search);
        } else {
            params.delete('search');
        }
        
        router.get(`/staff-profile?${params.toString()}`);
    }, []);

    const [search, setSearch] = React.useState(filters?.search || '');

    const rows: StaffProfile[] = Array.isArray(staffProfiles)
        ? staffProfiles
        : (staffProfiles.data ?? []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Staff Profiles" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <form onSubmit={handleSearch}>
                    <Input 
                        placeholder="search staff profiles" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1"
                    />
                </form>
                <Link href={create().url} className="btn">
                    <Button>+ Add Staff Profile</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <Table className="min-w-[1200px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Staff Number</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Clinic</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((staffProfile) => (
                                <TableRow key={staffProfile.id}>
                                    <TableCell>{staffProfile.id}</TableCell>
                                    <TableCell>{staffProfile.staff_number}</TableCell>
                                    <TableCell>{staffProfile.first_name} {staffProfile.last_name}</TableCell>
                                    <TableCell>{staffProfile.email || '-'}</TableCell>
                                    <TableCell>{staffProfile.phone_number}</TableCell>
                                    <TableCell>{staffProfile.gender}</TableCell>
                                    <TableCell>{staffProfile.clinic?.name || '-'}</TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Link href={edit(staffProfile.id).url}>
                                            <Button size="sm" variant="outline">
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button 
                                            size="sm" 
                                            variant="destructive"
                                            onClick={() => handleDelete(staffProfile.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="py-4 text-center"
                                >
                                    No staff profiles found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {(!Array.isArray(staffProfiles) && staffProfiles.links?.length) ? (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href={staffProfiles.prev_page_url ?? undefined} />
                            </PaginationItem>

                            {staffProfiles.links.map((link, idx) => {
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
                                <PaginationNext href={staffProfiles.next_page_url ?? undefined} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                ) : null}
            </div>
        </AppLayout>
    );
}
