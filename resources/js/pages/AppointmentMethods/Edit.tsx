import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

type Method = {
    id: number;
    code: string;
    name: string;
    description?: string | null;
    is_active: boolean;
};

type Props = {
    method: Method;
};

export default function AppointmentMethodEdit({ method }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        code: method.code || '',
        name: method.name || '',
        description: method.description || '',
        is_active: method.is_active ?? true,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/appointment-methods/${method.id}`);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Appointment Methods', href: '/appointment-methods' },
        { title: `Edit ${method.name}`, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${method.name}`} />
            <div className="mt-4 mb-4 flex items-center gap-2 px-4">
                <Link href="/appointment-methods" className="mr-2">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Edit Appointment Method</h1>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="code">Code *</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                required
                            />
                            {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2 col-span-full">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Optional description"
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
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
                        <Link href="/appointment-methods">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Method'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
