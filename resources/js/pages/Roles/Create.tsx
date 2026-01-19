import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Create Role',
        href: '#',
    },
];

export default function RoleCreate({ permissions }: { permissions: { [key: number]: string } }) {
    const { data, setData, post, errors } = useForm({
        name: '',
        permissions: [] as number[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/roles');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Create Role</h1>
                <Link href="/roles" className="btn">
                    <Button>Back</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <form onSubmit={submit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-bold" htmlFor="name">
                            Role Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter role name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && <div className="text-red-500 mt-2">{errors.name}</div>}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-bold">Permissions</label>
                        <div className="grid grid-cols-3 gap-4">
                            {Object.entries(permissions).map(([id, name]) => (
                                <div key={id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`permission-${id}`}
                                        value={id}
                                        onChange={(e) => {
                                            const permissionId = parseInt(e.target.value);
                                            const newPermissions = data.permissions.includes(permissionId)
                                                ? data.permissions.filter((p) => p !== permissionId)
                                                : [...data.permissions, permissionId];
                                            setData('permissions', newPermissions);
                                        }}
                                        className="mr-2"
                                    />
                                    <label htmlFor={`permission-${id}`}>{name}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button type="submit">Create Role</Button>
                </form>
            </div>
        </AppLayout>
    );
}
