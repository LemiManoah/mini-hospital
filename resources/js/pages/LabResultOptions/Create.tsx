import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Props {
    services: Array<{ id: number; name: string }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Lab Result Options', href: '/lab-result-options' },
    { title: 'New Result Option', href: '#' },
];

export default function LabResultOptionCreate({ services }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        lab_test_id: '',
        option_value: '',
        label: '',
        is_abnormal: false,
        sort_order: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/lab-result-options');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Lab Result Option" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href="/lab-result-options">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">New Lab Result Option</h1>
                </div>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="lab_test_id">Lab Test *</Label>
                        <Select
                            value={data.lab_test_id}
                            onValueChange={(value) => setData('lab_test_id', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select lab test" />
                            </SelectTrigger>
                            <SelectContent>
                                {services.map((service) => (
                                    <SelectItem key={service.id} value={service.id.toString()}>
                                        {service.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.lab_test_id && <p className="text-sm text-red-500">{errors.lab_test_id}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="option_value">Option Value *</Label>
                            <Input
                                id="option_value"
                                value={data.option_value}
                                onChange={(e) => setData('option_value', e.target.value)}
                                placeholder="e.g., positive"
                            />
                            {errors.option_value && <p className="text-sm text-red-500">{errors.option_value}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="label">Label *</Label>
                            <Input
                                id="label"
                                value={data.label}
                                onChange={(e) => setData('label', e.target.value)}
                                placeholder="e.g., Positive"
                            />
                            {errors.label && <p className="text-sm text-red-500">{errors.label}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="sort_order">Sort Order</Label>
                            <Input
                                id="sort_order"
                                type="number"
                                min="0"
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                            />
                            {errors.sort_order && <p className="text-sm text-red-500">{errors.sort_order}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_abnormal"
                                checked={data.is_abnormal}
                                onChange={(e) => setData('is_abnormal', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <Label htmlFor="is_abnormal">Mark as Abnormal</Label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link href="/lab-result-options">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Result Option'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
