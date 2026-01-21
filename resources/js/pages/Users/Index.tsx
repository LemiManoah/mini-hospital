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
import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users',
        href: '/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at?: string;
    roles?: Array<{
        id: number;
        name: string;
    }>;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url?: string;
    next_page_url?: string;
    links: Array<{
        url?: string;
        label: string;
        active: boolean;
    }>;
}

export default function UsersIndex({
    users,
    filters,
}: {
    users: User[] | PaginatedUsers;
    filters?: {
        search?: string;
    };
}) {
    const handleDelete = useCallback((id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/users/${id}`);
        }
    }, []);

    const [search, setSearch] = React.useState(filters?.search || '');

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
        
        router.get(`/users?${params.toString()}`);
    }, []);

    const rows: User[] = Array.isArray(users)
        ? users
        : (users.data ?? []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <form onSubmit={handleSearch}>
                    <Input 
                        placeholder="search users" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1"
                    />
                </form>
                <Link href="/users/create" className="btn">
                    <Button>+ Add User</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead>Verified</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {user.roles?.map((role) => (
                                                <Badge key={role.id} variant="secondary">
                                                    {role.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.email_verified_at ? (
                                            <Badge variant="default">Yes</Badge>
                                        ) : (
                                            <Badge variant="outline">No</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                                    </TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Link href={`/users/${user.id}/edit`}>
                                            <Button size="sm" variant="outline">
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button 
                                            size="sm" 
                                            variant="destructive"
                                            onClick={() => handleDelete(user.id)}
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
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {(!Array.isArray(users) && users.links?.length) ? (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href={users.prev_page_url ?? undefined} />
                            </PaginationItem>

                            {users.links.map((link, idx) => {
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
                                <PaginationNext href={users.next_page_url ?? undefined} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                ) : null}
            </div>
        </AppLayout>
    );
}
