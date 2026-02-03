import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';
import { index as indexRoute } from '@/routes/stores';
import { Store } from '@/types/store';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Stores',
        href: indexRoute().url,
    },
    {
        title: 'Edit Store',
        href: '#',
    },
];

export default function StoreEdit({ store }: { store: Store }) {
    const { data, setData, put, processing, errors } = useForm({
        name: store.name || '',
        code: store.code || '',
        is_main: Boolean(store.is_main),
        allow_direct_receipt: Boolean(store.allow_direct_receipt),
        is_active: Boolean(store.is_active),
        notes: store.notes || '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/stores/${store.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Store" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href={indexRoute().url} className="mr-2">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Store</h1>
                </div>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Store Name *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code">Store Code *</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                required
                            />
                            {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                        </div>

                        <div className="space-y-2 col-span-full">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                            {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_main"
                                    checked={data.is_main}
                                    onCheckedChange={(checked) => setData('is_main', Boolean(checked))}
                                />
                                <Label htmlFor="is_main">Main Store</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="allow_direct_receipt"
                                    checked={data.allow_direct_receipt}
                                    onCheckedChange={(checked) => setData('allow_direct_receipt', Boolean(checked))}
                                />
                                <Label htmlFor="allow_direct_receipt">Allow Direct Receipt</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', Boolean(checked))}
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Link href={indexRoute().url}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
