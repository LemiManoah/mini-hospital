import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
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
import { create, edit, destroy, index} from '@/routes/roles';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Settings',
        href: '/settings',
    },
    {
        title: 'Roles',
        href: '/roles',
    },
];

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface PaginatedRoles {
    data: Role[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}


export default function RoleIndex({
    roles,
    filters,
}: {
    roles: PaginatedRoles;
    filters: { search?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');
    
        const handleSearch = (e: React.FormEvent) => {
            e.preventDefault();
            router.get(index.url({ query: { search } }), {}, { preserveState: true, replace: true });
        };
    
        // const handleClear = () => {
        //     setSearch('');
        //     router.get(index.url({ query: {} }), {}, { preserveState: true, replace: true });
        // };
    
    const handleDelete = useCallback((id: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(destroy(id).url);
        }
    }, []);
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <form onSubmit={handleSearch}>
                    <Input 
                        placeholder="search roles" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1"
                    />
                </form>
                <Link href={create().url} className="btn">
                    <Button>+ Add Role</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <Table className="min-w-[900px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Permissions</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.data.length > 0 ? (
                            roles.data.map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell>{role.id}</TableCell>
                                    <TableCell>{role.name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {role.permissions && role.permissions.length > 0 ? (
                                                role.permissions.map((permission) => (
                                                    <span 
                                                        key={permission.id}
                                                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                                    >
                                                        {permission.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 text-sm italic">No permissions</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Link href={edit(role.id).url}>
                                            <Button size="sm" variant="outline">
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button 
                                            size="sm" 
                                            variant="destructive"
                                            onClick={() => handleDelete(role.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="py-4 text-center"
                                >
                                    No roles found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {roles.links && (
                    <div className="mt-4 flex justify-end">
                        <div className="flex items-center gap-2">
                            {roles.links.map((link, index: number) => (
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
        </AppLayout>
    );
}
