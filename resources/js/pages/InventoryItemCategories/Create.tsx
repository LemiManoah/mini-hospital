import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';
import { index as indexRoute } from '@/routes/inventory-item-categories';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Inventory Item Categories',
        href: indexRoute().url,
    },
    {
        title: 'Create Category',
        href: '#',
    },
];

export default function InventoryItemCategoryCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        is_active: true,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/inventory-item-categories');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Item Category" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href={indexRoute().url} className="mr-2">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Create Item Category</h1>
                </div>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Category Name *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter category name"
                                required
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', Boolean(checked))}
                            />
                            <Label htmlFor="is_active">Active</Label>
                            {errors.is_active && <p className="text-sm text-red-500">{errors.is_active}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Link href={indexRoute().url}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Category'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
