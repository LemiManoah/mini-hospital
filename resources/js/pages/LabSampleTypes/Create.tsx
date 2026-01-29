import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Lab Sample Types', href: '/lab-sample-types' },
    { title: 'New Sample Type', href: '#' },
];

export default function LabSampleTypeCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        description: '',
        default_container: '',
        default_volume: '',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/lab-sample-types');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Lab Sample Type" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href="/lab-sample-types">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">New Lab Sample Type</h1>
                </div>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Sample Type Name *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g., Blood"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code">Code *</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                placeholder="e.g., BLD"
                                maxLength={20}
                            />
                            {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Optional description of the sample type"
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="default_container">Default Container</Label>
                            <Input
                                id="default_container"
                                value={data.default_container}
                                onChange={(e) => setData('default_container', e.target.value)}
                                placeholder="e.g., EDTA Tube"
                            />
                            {errors.default_container && <p className="text-sm text-red-500">{errors.default_container}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="default_volume">Default Volume</Label>
                            <Input
                                id="default_volume"
                                value={data.default_volume}
                                onChange={(e) => setData('default_volume', e.target.value)}
                                placeholder="e.g., 5ml"
                            />
                            {errors.default_volume && <p className="text-sm text-red-500">{errors.default_volume}</p>}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <Label htmlFor="is_active">Active</Label>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link href="/lab-sample-types">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Sample Type'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
